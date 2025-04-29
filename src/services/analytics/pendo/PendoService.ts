import { User } from 'boclips-api-client/dist/sub-clients/users/model/User';
import Pendo = pendo.Pendo;

export class PendoService {
  private readonly pendoInstance?: Pendo;

  public constructor(pendo?: Pendo) {
    if (!pendo) {
      console.error('Pendo is not defined');
    } else {
      this.pendoInstance = pendo;
    }
  }

  public identify(user: User) {
    if (this.pendoInstance) {
      this.pendoInstance.initialize({
        visitor: {
          id: user.id,
          email: user.email,
          full_name: `${user.firstName} ${user.lastName}`,
          role: user.jobTitle || '',
          content: user.desiredContent || '',
          audiences: user.audiences || [],
        },
        account: {
          id: user.account?.id || 'n/a',
          name: user.account?.name || 'n/a',
          type: user.account?.marketingInformation?.companySegments || [],
          product: user.account?.products || [],
        },
      });
    }
  }

  public trackClassroomAccountCreationFailure(
    email: string,
    schoolName: string,
    errorMessage?: string,
  ) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Classroom Registration Failure', {
        email,
        schoolName,
        errorMessage,
      });
    }
  }

  public trackClassroomDistrictAccountCreationFailure(
    email: string,
    districtName: string,
    errorMessage?: string,
  ) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Classroom District Registration Failure', {
        email,
        districtName,
        errorMessage,
      });
    }
  }

  public trackAssistantEntryPointUsed(entryPoint: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Entry Point Used', { entryPoint });
    }
  }

  public trackAssistantSuggestionClicked(suggestion: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Suggestion Clicked', { suggestion });
    }
  }

  public trackAssistantConversationReset() {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Conversation Reset', {});
    }
  }

  public trackAssistantVideoNavigatedTo(clipId: string, videoId: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Video Navigated To', {
        clipId,
        videoId,
      });
    }
  }

  public trackAssistantHighlightEmbedded(clipId: string, videoId: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Highlight Embedded', {
        clipId,
        videoId,
      });
    }
  }

  public trackAssistantHighlightShared(clipId: string, videoId: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Highlight Shared', {
        clipId,
        videoId,
      });
    }
  }

  public trackAssistantSidebarQuestionJumpedTo() {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Sidebar Question Jumped To', {});
    }
  }

  public trackAssistantSidebarClipJumpedTo(clipId: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Assistant Sidebar Clip Jumped To', { clipId });
    }
  }

  public trackTrapDoorInterest(testName: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Trap Door Interest Registered', { testName });
    }
  }

  public trackTrapDoorSignUp(testName: string) {
    if (this.pendoInstanceIsReady()) {
      this.pendoInstance.track('Trap Door Signed Up', { testName });
    }
  }

  private pendoInstanceIsReady(): boolean {
    return (
      this.pendoInstance &&
      this.pendoInstance.isReady &&
      this.pendoInstance.isReady()
    );
  }
}
