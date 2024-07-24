import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await fetch("/api/user/change-password", {
    method: "PATCH",
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
};

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(50),
    newPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(50),
    confirmPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(50),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

const ChangePasswordForm: React.FC = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    const { oldPassword, newPassword, confirmPassword } = values;
    try {
      const result = await changePassword(
        oldPassword,
        newPassword,
        confirmPassword
      );
      // redirect to profile
      console.log(result);
      router.push("/profile");
    } catch (err) {
      // stay in form
      console.log(err);
    }
  };

  return (
    <Card className="bg-kingfisher-daisy/60 border-0 text-white rounded">
      <CardHeader className="text-center">
        <CardTitle className="font-space-grotesk text-3xl">
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full flex items-center" type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
