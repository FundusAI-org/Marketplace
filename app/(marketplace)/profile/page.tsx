import { ShoppingBag, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { signOut } from "@/actions/auth.actions";
import ProfileCard from "@/components/ProfileCard";
import RecentOrders from "@/components/RecentOrders";
import EditProfile from "@/components/EditProfile";
import { validateRequest } from "@/lucia";
import { redirect } from "next/navigation";

export default async function CustomerProfilePage() {
  const { account: user } = await validateRequest();

  if (user) {
    return (
      <main className="container max-w-6xl bg-background py-6 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full p-6 sm:p-0 md:w-1/4">
            <ProfileCard
              user={{
                firstName: user.customer.firstName,
                lastName: user.customer.lastName,
                email: user.email,
                fundusPoints: user.customer.fundusPoints,
              }}
            />
            <div className="mt-6 flex gap-4">
              <Button variant="outline" size="lg" className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart
              </Button>
              <form action={signOut}>
                <Button variant="default" size="lg" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </aside>
          <div className="-mt-6 flex-1 p-6">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <EditProfile
                  user={{
                    ...user,
                    firstName: user.customer.firstName,
                    lastName: user.customer.lastName,
                  }}
                />
              </TabsContent>
              <TabsContent value="orders">
                <RecentOrders
                  recentOrders={[
                    {
                      id: "1",
                      date: "2023-05-01",
                      total: 75.99,
                      status: "Delivered",
                    },
                    {
                      id: "2",
                      date: "2023-05-15",
                      total: 124.5,
                      status: "Processing",
                    },
                    {
                      id: "3",
                      date: "2023-05-28",
                      total: 49.99,
                      status: "Shipped",
                    },
                  ]}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    );
  } else {
    redirect("/auth?action=login&redirect=/profile");
  }
}
