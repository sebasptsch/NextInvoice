## Purpose

This project was created for my IB ITGS IA to be submitted in February 2021.


## Components

This project was created using NEXTJS and Chakra-UI.

NEXTJS allowed me to use the Stripe API on the clientside without complications that would come with oauth and creating a seperate API. It uses a combination of Static Page Generation and Server Side Rendered Pages to make sure that whenever a user accesses a new page the data is always up-to-date. 
Another reason to use nextjs is it's integration with Vercel (it's creator company) who offer CD and hosting with an emphasis on "serverless" code and lambda functions. Using this functionality you can create custom api routes that don't require a seperately hosted service. (Also allows for login and sessions in order to protect api routes).

Chakra-UI had several features that made it applicable to the project, chief among them being it's compatability with React and **Dark Mode**. The final reason is it's responsive design which made it easy to create pages for both mobile and desktop without changing the code overly much. 

## The Requirements

The client is an art teacher who is moving from teaching in a school environment to teaching private art lessons to students at her studio. 

### The Problem

Previously the client noted almost all their information on pieces of paper and got the customers to bill themselves by calculating how much they owed based on rates emailed to them and then, after that sending that amount to a specified bank account.

### The solution

Using stripe we can manage the customers, the products, the pricing and the invoicing. As well as providing these different services stripe also offers hosted invoices which allow the customer to use several different payment methods. It also allows for reminder emails and emailed reciepts/invoices.

## Todo

- [x] Find out if the IB allows server-side code

### Layout and Other Functionality

- [x] Add Navigation
- [x] Add login?

### Enrollment

- [ ] Define Students
- [ ] Find a way to batch-invoice customers

### Invoices

- [x] Get Invoices
- [x] See products inside invoice and totals
- [x] Send Reminder Email
- [x] Create Invoices
- [x] Sort Invoices
- [x] Unpaid
- [x] By Customer

### Customers

- [x] List Customers
- [x] List Related Invoices
- [x] Create Customers
- [x] Operations on Customers

### Products

- [x] Get Products
- [x] Create Products
- [x] Modify Products
- [x] Operations on Products
- [x] Sort Prices by Product

### Other

- [x] Buy domain?
- [x] Connect domain email to stripe

## Notes

Customer Based Student Signup?
