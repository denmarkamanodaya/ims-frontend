import axios from "axios";

export function deleteSubscriber(id: any) {
  axios
    .delete(`http://localhost:3000/dev/ims/subscriber/${id}`)
    .then(() => console.log("deleted", id))
    .catch((err) => {
      console.log(err);
    });
}

export function putSubscriber(data: any) {
  const { pathParameter: id, details } = data;
  axios
    .put(`http://localhost:3000/dev/ims/subscriber/${id}`, details)
    .then(() => {
      console.log("Operation Successful");
      alert(`Operation Successful! ${id}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function getSubscribers(value: string) {
  const response = await axios.get("http://localhost:3000/dev/ims/subscribers");
  return response.data.data.filter((obj: any) =>
    obj.phoneNumber.includes(value)
  );
}
