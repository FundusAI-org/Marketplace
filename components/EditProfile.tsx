import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UpdateSolanaWallet } from "./UpdateSolanaAddress";
import { validateRequest } from "@/lucia";
// import { useSession } from "@/providers/session.provider";

interface EditProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const EditProfile: FC<EditProfileProps> = async (user) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  // value={user.firstName}
                  // onChange={(e) =>
                  //   setUser({ ...user, firstName: e.target.value })
                  // }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  // value={user.lastName}
                  // onChange={(e) =>
                  //   setUser({ ...user, lastName: e.target.value })
                  // }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                // value={user.email}
                // onChange={(e) =>
                //   setUser({ ...user, email: e.target.value })
                // }
              />
            </div>
          </div>
          <Button type="submit" className="mt-4">
            Update Profile
          </Button>
        </form>
        {/* <UpdateSolanaWallet
          currentAddress={user?.solanaWalletAddress ?? null}
        /> */}
      </CardContent>
    </Card>
  );
};

export default EditProfile;
