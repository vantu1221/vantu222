import { useRoutes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/adminLayout";
import Homepage from "./pages/foodsList";
import FoodsAdd from "./pages/foodsAdd";
import FoodsEdit from "./pages/foodsEdit";
import FoodDetail from "./pages/detailFoods";

const routeConfigs = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "food-list", // URL: /admin/food-list
        element: <Homepage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "food-add", // URL: /admin/food-list
        element: <FoodsAdd />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "food-edit/:id", // URL: /admin/food-list
        element: <FoodsEdit />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "food-detail/:id", // URL: /admin/food-list
        element: <FoodDetail />,
      },
    ],
  },
];

function App() {
  const routes = useRoutes(routeConfigs);
  return <div>{routes}</div>;
}

export default App;
