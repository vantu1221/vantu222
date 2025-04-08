import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

type RegisterInput = {
  email: string;
  password: string;
};

// API gọi đăng ký
const registerUser = async (user: RegisterInput) => {
  return await axios.post("http://localhost:3000/register", user);
};

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Đăng ký thành công!");
      navigate("/login");
    },
    onError: (error: AxiosError) => {
      alert(error.response?.data || "Đăng ký thất bại!");
    }
  });

  const onSubmit: SubmitHandler<RegisterInput> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">Đăng Ký</h1>
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
          {mutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
        </Button>

        <br />
        <Button variant="secondary" href="/login" className="py-2 mt-3">Đã có tài khoản? Đăng nhập</Button>
      </Form>
    </Container>
  );
}

export default Register;
