import { DashboardLayout } from "@/components/layout";
import { Forms } from "@/components/ui";

const UserForms = () => {
  return (
    <DashboardLayout title="Register New User">
      <Forms
        title="User Forms"
        buttonLabel="Submit"
        loading={false}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          // console.log(formData.get("name"));
          // console.log(formData.get("email"));
          // console.log(formData.get("password"));
          // console.log(formData.get("address"));
        }}
        fields={[
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "John Doe",
          },
          {
            type: "email",
            name: "email",
            label: "Email",
            placeholder: "you@example.com",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            placeholder: "••••••••",
          },
          {
            type: "textarea",
            name: "address",
            label: "Address",
            placeholder: "123 Maple Street Anytown, PA 17101",
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default UserForms;
