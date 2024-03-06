context('Playlist page', () => {
  it('renders empty playlist', () => {
    cy.visit('/');
    cy.bo((bo) => bo.create.emptyPlaylist());
    cy.get('[data-qa="playlists-button"]').click();

    cy.findByText('My empty playlist').click();

    cy.get('[data-qa="playlistTitle"]').should('be.visible');

    cy.percySnapshot('Empty playlist view');
  });

  it('can update playlist with new videos order (drag n drop)', () => {
    cy.visit('/');
    cy.bo((bo) => {
      bo.inspect().links.cart = {
        href: 'https://www.boclips.com',
        templated: false,
      };
    });
    cy.bo((bo) => bo.create.playlistWithVideos());
    cy.get('[data-qa="playlists-button"]').click();

    cy.findByText('My playlist').click();
    cy.findByText('Options').click();
    cy.findByText('Reorder videos').click();

    cy.findAllByText('video title').then((it) => {
      const item1 = it.get(0);
      const item2 = it.get(1);
      const item3 = it.get(2);

      expect(item1.closest('li').getAttribute('data-qa')).equals(
        'data-video-1',
      );
      expect(item2.closest('li').getAttribute('data-qa')).equals(
        'data-video-2',
      );
      expect(item3.closest('li').getAttribute('data-qa')).equals(
        'data-video-3',
      );
    });

    cy.percySnapshot('Reorder videos in playlist');

    cy.get('[data-qa="data-video-1"]')
      .focus()
      .then((el) => {
        el[0].dispatchEvent(
          new KeyboardEvent('keydown', { keyCode: 32, which: 32 }),
        );
        return el;
      })
      .then((el) => {
        el[0].dispatchEvent(
          new KeyboardEvent('keydown', { keyCode: 40, which: 40 }),
        );
        return el;
      })
      .then((el) => {
        el[0].dispatchEvent(
          new KeyboardEvent('keydown', { keyCode: 32, which: 32 }),
        );
      });

    cy.findAllByText('video title').then((it) => {
      const item1 = it.get(0);
      const item2 = it.get(1);
      const item3 = it.get(2);

      expect(item1.closest('li').getAttribute('data-qa')).equals(
        'data-video-2',
      );
      expect(item2.closest('li').getAttribute('data-qa')).equals(
        'data-video-1',
      );
      expect(item3.closest('li').getAttribute('data-qa')).equals(
        'data-video-3',
      );
    });

    cy.findByText('Update').click();

    cy.get('[data-qa="grid-card-for-video title"]').then((it) => {
      const item1 = it.get(0);
      const item2 = it.get(1);
      const item3 = it.get(2);

      expect(item1.firstElementChild.getAttribute('data-qa')).equals('video-2');
      expect(item2.firstElementChild.getAttribute('data-qa')).equals('video-1');
      expect(item3.firstElementChild.getAttribute('data-qa')).equals('video-3');
    });
  });
});
