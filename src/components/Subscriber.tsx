import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteSubscriber, putSubscriber } from "./../api/ims";
import { stateDefinitionSubscriber } from "../utils/states";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export const Subscriber = (props: any) => {
  const location = useLocation();
  const data = location.state?.data;

  const [details, setDetails] = useState(stateDefinitionSubscriber);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value =
      name == "status"
        ? event.target.checked
          ? "ACTIVE"
          : "INACTIVE"
        : event.target.value;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (event: any, id: string) => {
    event.preventDefault();

    // Normalize JSON object
    Object.entries(details).map(([key, value]) =>
      value.length === 0 ? delete details[key] : null
    );

    const pathParameter = id !== null ? id : details.phoneNumber;

    Object.keys(details).length == 0
      ? alert("No data to be updated.")
      : putSubscriber({ pathParameter, details });
  };

  const handleDelete = (phoneNumber: any) => deleteSubscriber(phoneNumber);

  return (
    <>
      <div className="details-container">
        <h1>{data ? "Subscriber Information" : "Register Subscriber"}</h1>

        <form
          onSubmit={(event) =>
            handleSubmit(event, data?.phoneNumber ? data.phoneNumber : null)
          }
        >
          {data ? (
            <span className="title">{data.phoneNumber}</span>
          ) : (
            <FloatingLabel label="phoneNumber" className="mb-3">
              <Form.Control
                type="text"
                name="phoneNumber"
                defaultValue={data ? data.phoneNumber : null}
                onChange={handleChange}
                required={data ? false : true}
              />
            </FloatingLabel>
          )}
          <FloatingLabel label="username" className="mb-3">
            <Form.Control
              type="text"
              name="username"
              defaultValue={data ? data.username : null}
              onChange={handleChange}
              required={data ? false : true}
            />
          </FloatingLabel>

          <FloatingLabel label="domain" className="mb-3">
            <Form.Control
              type="text"
              name="domain"
              defaultValue={data ? data.domain : null}
              onChange={handleChange}
              required={data ? false : true}
            />
          </FloatingLabel>

          <FloatingLabel label="password" className="mb-3">
            <Form.Control
              type="password"
              name="password"
              defaultValue={data ? data.password : null}
              onChange={handleChange}
              required={data ? false : true}
            />
          </FloatingLabel>

          <Form.Check
            type="checkbox"
            label=" status"
            name="status"
            onChange={handleChange}
            defaultChecked={data?.status === "ACTIVE" ? true : false}
          />

          {data ? JSON.stringify(data.features) : null}

          <div className="actions">
            <Button type="submit" variant="primary">
              {data ? "Save" : "Register"}
            </Button>{" "}
            {data ? (
              <a
                href="/"
                className="delete-button btn btn-danger"
                onClick={() => {
                  window.confirm(
                    `Are you sure you want to delete this user? ${data.phoneNumber}`
                  ) && handleDelete(data.phoneNumber);
                }}
              >
                delete
              </a>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
};

export default Subscriber;
