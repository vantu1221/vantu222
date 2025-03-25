import { SubmitHandler, useForm } from "react-hook-form";
import axios from 'axios';
import { Form, Button, Container, Alert } from "react-bootstrap";
import {  useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

type FoodInput = {
    name: string;
    price: number;
    image: string;
    quantity: number;
};

function FoodsEdit() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FoodInput>();
    const { id } = useParams();

    const getFoodsDetail = async (id: string) => {
        try {
            const { data } = await axios.get(`http://localhost:3000/foods/${id}`);
            reset({
                name: data.name,
                image: data.image,
                price: data.price,
                quantity: data.quantity
            });
        } catch (error) {
            console.log(error);
        }
    };
    const nav=useNavigate();
    const onSubmitEdit: SubmitHandler<FoodInput> = async (data) => {
        try {
            const response = await axios.put(`http://localhost:3000/foods/${id}`, data);
            if (response.status === 200) {
                alert("Sửa thành công");
                nav('/admin/food-list')
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!id) return;
        getFoodsDetail(id);
    }, [id]);

    return (
        <Container>
            <h1 className="my-4 text-center">Edit Food</h1>
            <Form onSubmit={handleSubmit(onSubmitEdit)}>
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

                <Button type="submit" variant="primary">Update</Button>
            </Form>
        </Container>
    );
}

export default FoodsEdit;
