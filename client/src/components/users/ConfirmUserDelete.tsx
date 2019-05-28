import React, { Dispatch, SetStateAction} from 'react';

interface Props {
  deleteUser: () => {};
  toggleConfirmUserDelete: Dispatch<SetStateAction<boolean>>;
}

export const ConfirmUserDelete = ({
  deleteUser, toggleConfirmUserDelete
}: Props) => {
  return <section>
    <p>Are you sure you want to delete your account?</p>
    <div>
      <button onClick={deleteUser}>Confirm</button>
      <button onClick={() => toggleConfirmUserDelete(false)}>Cancel</button>
    </div>
  </section>
};