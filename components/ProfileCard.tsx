import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileCardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    fundusPoints: number;
  };
}

const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your account settings and view your Fundus Points.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium">Fundus Points</p>
          <p className="text-2xl font-bold">{user.fundusPoints}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
