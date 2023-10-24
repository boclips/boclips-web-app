import { useLocationParams } from 'src/hooks/useLocationParams';
import { displayNotification } from 'src/components/common/notification/displayNotification';

export const useEmailVerified = () => {
  const locationParams = useLocationParams();

  if (locationParams.get('email_verified')) {
    displayNotification('success', 'Success!', 'Email successfully verified');
  }
};
