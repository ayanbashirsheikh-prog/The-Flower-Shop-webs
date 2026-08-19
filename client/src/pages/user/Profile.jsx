import { useSelector } from "react-redux";
import UserSidebar from "../../components/user/UserSidebar";

export default function Profile() {

  const user = useSelector(
    (state) => state.auth.user
  );

  return (
    <section className="bg-[#fffafc] min-h-screen py-10">

      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-4">

        <div>
          <UserSidebar />
        </div>

        <div className="lg:col-span-3">

          <div className="rounded-3xl bg-white p-8 shadow-sm">

            <h1 className="mb-8 text-3xl font-bold">
              My Profile
            </h1>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label>Name</label>

                <input
                  value={user?.name || ""}
                  className="mt-2 w-full rounded-2xl border p-4"
                  readOnly
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  value={user?.email || ""}
                  className="mt-2 w-full rounded-2xl border p-4"
                  readOnly
                />
              </div>

              <div>
                <label>Role</label>

                <input
                  value={user?.role || ""}
                  className="mt-2 w-full rounded-2xl border p-4"
                  readOnly
                />
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}