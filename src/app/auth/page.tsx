import { cn } from "@/lib/utils";
import AuthenticationSelection from "@/app/auth/components/AuthenticationSelection";

const motto = [
	"Welcome to Mood Journal! Your personal space to reflect on your emotions. Sign up or log in to begin your journey.",
	"Greetings from Mood Journal! Capture your feelings and track your emotional journey. Sign up or log in to get started.",
	"Hello and welcome to Mood Journal! Your journey towards better understanding your mood starts here. Sign up or log in to begin.",
	"Welcome to Mood Journal! Start documenting your emotions today. Sign up or log in to explore your feelings.",
	"Welcome to Mood Journal! Track your emotional well-being with ease. Sign up or log in to start your journaling experience.",
	"Welcome to Mood Journal! Your daily companion for tracking and understanding your mood. Sign up or log in to begin.",
	"Welcome to Mood Journal! A simple way to keep track of your feelings and emotions. Sign up or log in to get started.",
	"Welcome to Mood Journal! Start your emotional journey with us today. Sign up or log in to begin tracking your mood.",
	"Welcome to Mood Journal! Discover the power of emotional awareness. Sign up or log in to start your journey.",
	"Welcome to Mood Journal! Your tool for emotional insight and growth. Sign up or log in to begin exploring your feelings.",
];

const AuthPage = () => {
	return (
		<>
			<div
				className={cn(
					"h-dvh grid grid-rows-[1fr,auto] lg:grid-rows-1 lg:grid-cols-2"
				)}
			>
				<section className="bg-background flex justify-center items-center px-8 md:px-[8rem]">
					<AuthenticationSelection />
				</section>
				<section className="bg-foreground text-primary-foreground flex justify-center items-start flex-col p-8 py-16 lg:py-0 lg:px-16">
					<h2 className="text-[3rem] mb-4">Mood Journal</h2>
					<p>{motto[Math.floor(Math.random() * motto.length)]}</p>
				</section>
			</div>
		</>
	);
};

export default AuthPage;
