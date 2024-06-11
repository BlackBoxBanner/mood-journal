"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SigninForm from "./SigninForm";
import SignUpForm from "./SignUpForm";

const AuthenticationSelection = () => {
	return (
		<>
			<Tabs defaultValue="signin" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signin">Sign in</TabsTrigger>
					<TabsTrigger value="signup">Sign up</TabsTrigger>
				</TabsList>
				<TabsContent value="signin" className="my-4">
					<SigninForm />
				</TabsContent>
				<TabsContent value="signup" className="my-4">
					<SignUpForm />
				</TabsContent>
			</Tabs>
		</>
	);
};

export default AuthenticationSelection;
