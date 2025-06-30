
import { LogIn } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../context/auth-context"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../lib/auth"
import { toast } from "sonner"

interface LoginFormInputs {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});



export default function LoginPage() {
    const { setLoginUser } = useAuth()
    const router = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });



    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        onSuccess: ({ data }) => {
            console.log("data", data)
            toast.success("Login successful! Redirecting...")
            setLoginUser(data?.user, data?.token);
            reset();
            router('/');
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSubmit = async (data: LoginFormInputs) => {
        mutate({ email: data.email, password: data.password })
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                        <LogIn className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")}
                                error={errors?.email?.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type='password'
                                {...register("password")}
                                placeholder="Enter your password"
                                error={errors?.password?.message}
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isPending}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
