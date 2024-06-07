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
    if (
      this.pendoInstance &&
      this.pendoInstance.isReady &&
      this.pendoInstance.isReady()
    ) {
      this.pendoInstance.track('Classroom Registration Failure', {
        email,
        schoolName,
        errorMessage,
      });
    }
  }
}
