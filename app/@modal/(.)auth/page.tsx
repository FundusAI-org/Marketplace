// import AuthenticationPage from "@/app/auth/page";
import { Modal } from "@/components/Modal";
import { UserAuthForm } from "@/components/UserAuthForm";

export default async function Auth() {
  return (
    <Modal>
      <UserAuthForm />
    </Modal>
  );
}
