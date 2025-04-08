import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

type LoginInput = {
  email: string;
  password: string;
};

// API gọi đăng nhập
const loginUser = async (user: LoginInput) => {
  return await axios.post("http://localhost:3000/login", user);
};

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      alert("Đăng nhập thành công!");
      navigate("/admin/movies-list");
    },
    onError: (error: AxiosError) => {
      alert(error.response?.data || "Đăng nhập thất bại!");
    }
  });

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Đăng Nhập</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" {...register("email", { required: "Email là bắt buộc" })} />
          {errors.email && <Alert variant="danger">{errors.email.message}</Alert>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control type="password" {...register("password", { required: "Mật khẩu là bắt buộc" })} />
          {errors.password && <Alert variant="danger">{errors.password.message}</Alert>}
        </Form.Group>

        <Button type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <br />
        <Button variant="secondary" href="/register" className="py-2 mt-3">Chưa có tài khoản? Đăng ký</Button>
      </Form>
    </Container>
  );
}

export default Login;
