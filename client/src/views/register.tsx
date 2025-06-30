import { UserPlus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../context/auth-context"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { registerUser } from "../lib/auth"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
}

const schema = yup.object({
    name: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    photoURL: yup.string().url("Invalid URL").optional(),
});

export default function RegisterPage() {
    const { setLoginUser } = useAuth()
    const router = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: ({ data }) => {
            toast.success("Login successful! Redirecting...")
            setLoginUser(data?.user, data?.token);
            reset();
            router('/');
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSubmit = async (data: RegisterFormInputs) => {
        mutate({ ...data })
    }


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription>Join EventHub and start managing your events</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                {...register("name")}
                                error={errors?.name?.message}
                            />
                        </div>

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
                                placeholder="Create a password"
                                {...register("password")}
                                error={errors?.password?.message}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photoURL">Profile Photo URL (Optional)</Label>
                            <Input
                                id="photoURL"
                                type="url"
                                placeholder="https://example.com/photo.jpg"
                                {...register("photoURL")}
                                error={errors?.photoURL?.message}
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isPending}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
