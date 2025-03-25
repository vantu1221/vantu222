import { SubmitHandler, useForm } from "react-hook-form";
import axios from 'axios';
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


type FoodInput = {
    name: string;
    price: number;
    image: string;
    quantity: number;
};

function FoodsAdd() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FoodInput>();
    const nav=useNavigate();
    const onSubmit: SubmitHandler<FoodInput> = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/foods', data);
            if (response.status === 201) {
                alert("Thêm thành công");
                nav('/admin/food-list')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Create Food</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" {...register('name', { required: 'Name is required' })} />
                    {errors.name && <Alert variant="danger">{errors.name.message}</Alert>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="text" {...register('image', { required: 'Image URL is required' })} />
                    {errors.image && <Alert variant="danger">{errors.image.message}</Alert>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" {...register('price', { required: 'Price is required' })} />
                    {errors.price && <Alert variant="danger">{errors.price.message}</Alert>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" {...register('quantity', { required: 'Quantity is required' })} />
                    {errors.quantity && <Alert variant="danger">{errors.quantity.message}</Alert>}
                </Form.Group>

                <Button type="submit" variant="primary">Thêm mới</Button>
                <br />
                <Button variant="primary" href="food-list" className=" py-2 mt-3">Danh sách</Button>
            </Form>
        </Container>
    );
}

export default FoodsAdd;
