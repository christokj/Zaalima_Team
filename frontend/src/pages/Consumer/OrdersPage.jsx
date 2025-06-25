import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../config/axiosInstance'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

function OrdersPage() {

  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState('')

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = async (id) => {
    console.log(id, review)
    try {
      await axiosInstance({
        url: "/user/add-review",
        method: "POST",
        data: { review, id }
      });

      toast.success("Review added")
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Error submitting review');
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  }

  useEffect(() => {
    if (orders.length === 0) {

      axiosInstance({
        url: '/user/show-orders',
        method: 'GET'
      }).then((response) => {
        setOrders(response.data.orderHistory)
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, [orders]);
  if (!orders) {
    return ''
  }

  return (
    <>
      <div className="container mx-auto my-10 mt-28">
        <h1 className="text-3xl font-bold mb-5 text-center">Order History</h1>
        <div className="overflow-x-auto">
          <table className="table w-full ">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 ">
                        <div className=" w-20 md:w-16 ">
                          <img src={order.productId.image[0]} alt={order.productName} />
                        </div>
                        <div className="font-bold">{order.productId.title} ({order.quantity})</div>
                      </div>
                      <div className='flex right-0'>
                        {isAuthenticated && <form className="space-y-2" >
                          <textarea
                            className="textarea textarea-bordered w-30 h-10"
                            placeholder="Write a review"
                            onChange={(e) => setReview(e.target.value)}
                          />
                          <button className="btn btn-sm bg-main text-white " type="button" onClick={() => handleSubmit(order.productId._id)}>
                            Submit
                          </button>
                        </form>
                        }
                      </div>

                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <span
                      className='badge badge-warning'>
                      <h3>Shipped</h3>
                    </span>
                  </td>
                  <td>{Math.round(order.productId.price * order.quantity * 83)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default OrdersPage