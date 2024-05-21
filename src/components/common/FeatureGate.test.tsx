import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AdminLinksKey, FeatureGate } from 'src/components/common/FeatureGate';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import {
  AccountType,
  Product,
} from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe(`FeatureGate`, () => {
  describe('Feature flag', () => {
    it(`shows component when feature is enabled`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_PRICES: true } }),
      );
      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <FeatureGate feature="BO_WEB_APP_PRICES">
              <div>Hello there</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await screen.findByText('Hello there')).toBeVisible();
    });

    it(`hides component when feature is disabled`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_PRICES: false } }),
      );
      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate feature="BO_WEB_APP_PRICES">
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).not.toBeInTheDocument();
      });
    });

    it(`renders the fallback if provided and feature not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({ features: { BO_WEB_APP_PRICES: false } }),
      );
      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <FeatureGate feature="BO_WEB_APP_PRICES" fallback={<div>Hi</div>}>
              <div>Should not see this</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await screen.findByText('Hi')).toBeVisible();
      expect(screen.queryByText('Should not see this')).toBeNull();
    });
  });

  describe('Link', () => {
    it(`hides component when link not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.links.cart = null;

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate linkName="cart">
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).not.toBeInTheDocument();
      });
    });

    it(`shows component when link present`, async () => {
      const fakeClient = new FakeBoclipsClient();

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate linkName="placeOrder">
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).toBeInTheDocument();
      });
    });

    it(`renders the fallback if provided and link not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.links.cart = null;

      const client = new QueryClient();
      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <FeatureGate linkName="cart" fallback={<div>Hi</div>}>
              <div>Should not see this</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await screen.findByText('Hi')).toBeVisible();
      expect(screen.queryByText('Should not see this')).toBeNull();
    });
  });

  describe('Links', () => {
    it(`hides component when all links not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.links.cart = null;
      fakeClient.links.accountUsers = null;

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate
              anyLinkName={['cart', 'accountUsers'] as AdminLinksKey[]}
            >
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).not.toBeInTheDocument();
      });
    });

    it(`shows component when any of the links is present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.links.cart = null;

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate
              anyLinkName={['placeOrder', 'cart'] as AdminLinksKey[]}
            >
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).toBeInTheDocument();
      });
    });

    it(`renders the fallback if provided and link not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.links.cart = null;

      const client = new QueryClient();
      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <FeatureGate
              anyLinkName={['cart'] as AdminLinksKey[]}
              fallback={<div>Hi</div>}
            >
              <div>Should not see this</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await screen.findByText('Hi')).toBeVisible();
      expect(await screen.queryByText('Should not see this')).toBeNull();
    });
  });

  describe('Product', () => {
    it(`hides component when product not present`, async () => {
      const fakeClient = new FakeBoclipsClient();
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate product={Product.B2B}>
              <div>I am hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am hidden')).not.toBeInTheDocument();
      });
    });

    it(`shows component when product is present`, async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.B2B],
            type: AccountType.STANDARD,
          },
        }),
      );

      const client = new QueryClient();

      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <div>hi</div>
            <FeatureGate product={Product.B2B}>
              <div>I am not hidden</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByText('I am not hidden')).toBeInTheDocument();
      });
    });

    it(`renders the fallback if provided and product not present`, async () => {
      const fakeClient = new FakeBoclipsClient();

      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          account: {
            ...UserFactory.sample().account,
            id: 'acc-1',
            name: 'Ren',
            products: [Product.CLASSROOM],
            type: AccountType.STANDARD,
          },
        }),
      );

      const client = new QueryClient();
      render(
        <BoclipsClientProvider client={fakeClient}>
          <QueryClientProvider client={client}>
            <FeatureGate product={Product.LTI} fallback={<div>Hi</div>}>
              <div>Should not see this</div>
            </FeatureGate>
          </QueryClientProvider>
        </BoclipsClientProvider>,
      );

      expect(await screen.findByText('Hi')).toBeVisible();
      expect(screen.queryByText('Should not see this')).toBeNull();
    });
  });
});
