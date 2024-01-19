import { useLocationParams } from 'src/hooks/useLocationParams';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useEmailVerified = () => {
  const locationParams = useLocationParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (locationParams.get('email_verified')) {
      displayNotification('success', 'Success!', 'Email successfully verified');
      locationParams.delete('email_verified');
      navigator({
        search: locationParams.toString(),
      });
    }
  }, []);
};
