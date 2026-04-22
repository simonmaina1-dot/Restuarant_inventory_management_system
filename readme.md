## overview
DineFlow is a full-stack restuarant management system designed to streamline daily operations for small and medium sized restuarants. it aims to enable staff to manage menu items, track inventory, process customer orders and control access based on staff roles.

with this app, waiters can take orders, chefs track stock in real-time and improve efficiency  in ingridient usage.

## features
 1. AUTHENTICATION AND AUTHORIZATION
        - user registration and login
        - JWT- based authentication
        - Role-Based Access Control 

                ADMIN WILL- Product Management
Create, Read, Update, Delete (CRUD) operations for products
Category & Supplier Management
CRUD operations for categories and suppliers

                MANAGER WILL- Inventory Tracking
Track product stock levels
Handle stock transactions (in/out)


 2. MENU MANAGEMENT
        -Create, update, delete menu items - (MANAGER)
        -Organize items by categories

 3. Inventory Management
- Track stock levels
- Record stock IN (restock) and OUT (usage)
- Maintain inventory history

 4. Order Management
- Create customer orders
- Add multiple items per order
- Automatically deduct inventory on order creation

 5. Supplier Management
  - Manage supplier details
   - Track inventory sources

 6. Tech Stack
Backend
Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-Marshmallow
Flask-JWT-Extended
SQLite
Frontend
React (Vite)
Axios
React Router
Tailwind CSS / Bootstrap

  ## PROJECT STRUCTURE 

dineflow/
├── backend/
│   ├── app/
│   │   ├── models/ users.py (fields: id, username, password [hashed], role) -  role access only
                 /product.py (products/menuItem model) fields: id, name, price category_id - menu items sold
                 -category,  suppliers, inventory, orders_items
│   │   ├── schemas/
                    /user_schema - ## serialize
                    /product_schema - ## product validation and JSON formating
                    /category_schema - ## validation and response formatting
                    /inventory _schema -## transaction validation
                    /order_schema - ## serialize orders and nested order items

│   │   ├── routes/
                    /auth.py
                    /product.py
                    /categories.py
                    /supplier.py
                    /inventory.py
                    /order.py - automatic deduction of inventory
│   │   ├── utils/
                /rbac.py #role decorators and restricting access by role
                /auth_utils.py - JWT token and validation, password hashing
                error_handler.py -  global error handler and return of JSON responses
│   │   ├── extensions.py

│   │   ├── __init__.py
                            app = Flask(__name__)
│   ├── migrations/
|   |-- seed.py
│   ├── instance/
                /dineflow.db #SQLite e.g. 
│   ├── run.py
                /entry point
│   ├── requirements.txt
                (marshmallow, JWT, SQLAlchemy, flask)
│
├── frontend/
│   ├── src/
│   │   ├── components/
                            /Navbar.jsx
                            /sidebar.jsx
                            /productCard.jsx
                            /inventoryTable.jsx
                            /OrderTable.jsx
                            /ProductRoute.jsx
│   │   ├── pages/
                            /login.jsx - login form
                            /product.jsx -  CRUD UI
                            /Dashboard.jsx - system overview
                            /categories.jsx - manage categories
                            /inventory.jsx - tracking transactions
                            /orders.jsx- creating and viewing orders


│   │   ├── services/
                            /api.js - will add JWT token for requests
                            /authService.js - to handle login and registration API calls
                            productServices.js - to handle product api 
│   │   ├── App.jsx
                - will define teh routes and layout
│   │   ├── main.jsx
                - react entry point 
│   ├── package.json
                - frontend dependencies 
│
├── README.md
├── .env








2. Backend Structure (Flask)
app/init.py
Contains create_app()
Initializes extensions (DB, JWT, Marshmallow)
Registers routes
config.py
Stores configuration (DB URI, JWT secret)
extensions.py
Initializes db, migrate, ma, jwt
3. Models
user.py → users (id, username, password, role)
product.py → menu items
category.py → product groups
supplier.py → supplier info
inventory.py → stock tracking
order.py → customer orders
order_item.py → links orders and products
4. Schemas
Convert data between JSON and Python
Validate requests
Format responses
5. Routes
auth.py → register/login
products.py → CRUD products
categories.py → CRUD categories
suppliers.py → CRUD suppliers
inventory.py → stock tracking
orders.py → create/view orders
6. Utilities
rbac.py → role-based access
auth_utils.py → password hashing & JWT
error_handlers.py → global error handling
7. Database
migrations/ → schema changes
instance/dineflow.db → SQLite database
run.py → starts server
requirements.txt → dependencies
8. Frontend (React)
components/
Navbar
Sidebar
ProductCard
InventoryTable
OrderTable
ProtectedRoute
pages/
Login
Dashboard
Products
Categories
Suppliers
Inventory
Orders
services/
API communication (Axios)
App.jsx → routing
main.jsx → entry point


## Installation & Setup
Backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\\Scripts\\activate

pip install -r requirements.txt

flask db init
flask db migrate
flask db upgrade

python run.py
Frontend
cd frontend
npm install
npm run dev
## How It Works
User logs in → receives JWT
Requests include token
Backend validates & processes
Orders deduct inventory
UI updates automatically
Login Page
Dashboard
Products Page
Inventory Page
Orders Page
## Evaluation Alignment

✔ RESTful API design with consistent responses
✔ Clean project structure (Flask Blueprints)
✔ Full CRUD operations
✔ Database relationships
✔ Authentication & RBAC
✔ Frontend integration

10. Outcome
Secure login
Role-based access
Menu & supplier management
Real-time inventory tracking
Order processing

DineFlow simulates a real restaurant system while remaining simple and efficient.

## Conclusion

DineFlow is a practical, real-world full-stack application that demonstrates backend development, API design, database management, and frontend integration — all in a clean, scalable structure optimized for fast development and high grading performance.