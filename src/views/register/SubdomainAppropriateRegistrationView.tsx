import React from 'react';
import useUserProducts from 'src/hooks/useUserProducts';
import { checkIsProduct } from 'src/services/checkIsProduct';
import { Product } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';
import ClassroomRegistrationView from 'src/views/register/classroom/user/ClassroomRegistrationView';
import LibraryRegistrationView from 'src/views/register/library/LibraryRegistrationView';

const SubdomainAppropriateRegistrationView = () => {
  const { products } = useUserProducts();

  return checkIsProduct(Product.CLASSROOM, products) ? (
    <ClassroomRegistrationView />
  ) : (
    <LibraryRegistrationView />
  );
};

export default SubdomainAppropriateRegistrationView;
