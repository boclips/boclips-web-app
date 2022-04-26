import Organisation from 'src/services/hotjar/Organisation';

export default interface UserProfile {
  userId: string;
  organisation?: Organisation;
}
