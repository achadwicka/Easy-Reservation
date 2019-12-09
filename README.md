# Easy-Reservation
 
## Qué es Easy-Reservation
Easy reservation es una aplicación que te permitirá reservar fácilmente mesas en distintos restoranes a lo largo de Santiago, a diferencia de otras páginas de reserva con nosotros puedes dejar pedido que plato deseas. **¡Dile adiós a las eternas esperas!**

En caso de que representes a un restaurant unirte a nosotros te permitira alcanzar muchos mas clientes, ademas que te facilitará la planificación en la cocina ya que sabrás de antemano qué platos quieren y cuando los quieren.

___

 
# Estructura del código (./src/)
 
## app.js

Aquí se construye la aplicación _koa_ y se configuran los principales _middleware_ a utilizar en cada request

## config/database.js

Configuración de la base de datos, se requiere tener instalado PostgreSQL

## routes.js

Aquí está la declaración del _router_ principal, el cual maneja la mayor parte de los _requests_ que se le hagan a la app. Delega los diferentes _paths_ a los controladores respectivos (sub router)

## assets/images/

Imágenes "constantes" en la aplicación:
* logo de la app
* imagen default para usuarios, restoranes o platos

## assets/js/

Código JS del lado del cliente, en esta carpeta se encuentran los archivos de [React](https://es.reactjs.org/)

## assets/styles/

En esta carpeta se encuentran los distintos estilos usados en la app. Todos los archivos se unen en uno cuando se compila la app, por lo que hay que cuidar que los nombres de clases deben ser descriptivos.

## migrations/

Aquí van las migraciones necesarias para mantener consistente la base de datos

## models/

Se utiliza [Sequelize](https://sequelize.org/) como ORM, y en esta carpeta se encuentran los distintos modelos usados en la aplicación, para ver los modelos en particular dirígete [aquí](#models-1)

## routes/

En esta carpeta estan los controladores (o _sub-routers_) que manejan la lógica de la aplicación, para ver los controladores en particular dirígete [aquí](#routes-1)

## seeds/

Aquí se pueden encontrar las semillas para poblar la base de datos con datos de prueba

## views/


Si hay algún recurso que tenga representación que pueda ser _renderada_ en _browsers_ se encontrará en esta carpeta, se encuentran organizados en subcarpetas con el nombre de los distintos _routers_ que tiene la aplicación.

Aquí se encuentran las plantillas base de los archivos _HTML_ (_layout.html.ejs_) y la página de inicio de la app (_index.html.ejs_).

---
---

# Models
* [category](#category)
* [dish](#dish)
* [favouriteDishes](#favouriteDishes)
* [favouriteRestaurants](#favouriteRestaurants)
* [registration](#registration)
* [reservation](#reservation)
* [reservationdishes](#reservationdishes)
* [reservationtables](#reservationtables)
* [restaurant](#restaurant)
* [restaurantCategory](#restaurantCategory)
* [review](#review)
* [table](#table)
* [user](#user)
* [userVote](#userVote)

## index

Base para el funcionamiento de el _ORM_ de Sequelize

## category

Es la clasificación del restaurante según el tipo de comida que este ofrece (comida rapida, sushi, hamburguesería, etc).

Posee:
* id --> integer
* name --> string (nombre de la categoría)

Está conectado a:
* [restaurant](#restaurant) mediante [restaurantCategory](#restaurantCategory)

## dish

Son platos de los distintos restoranes

Posee:
* id --> integer
* description --> string (descripcion del plato)
* name --> string (nombre del plato)
* price --> float (precio del plato)

Está conectado a:
* [reservation](#reservation) mediante [reservationdishes](#reservationdishes)
* [restaurant](#restaurant) (belongsTo)
* [user](#user) mediante [favouriteDishes](#favouriteDishes)

## favouriteDishes

Une a los [usuarios](#user) con sus [platos](#dish) favoritos

Posee:
* dishId --> integer
* userId --> integer

## favouriteRestaurants

Une a los [usuarios](#user) con sus [restoranes](#restaurant) favoritos

Posee:
* restaurantId --> integer
* userId --> integer

## registration

Tabla que contiene a los usuarios o restaurantes que han iniciado sesión en la app

Posee:
* id --> uuid

Está conectado a:
* [restaurant](#restaurant) (belongsTo)
* [user](#user) (belongsTo)

## reservation

Son las reservas que los usuarios hacen en los restoranes, poseen un estado de aceptación que permite a los restoranes decidir si aceptar o no la reserva

Posee:
* id --> integer
* acceptance --> integer (estado de aceptación: 0.- pendiente, 1.- aceptada, 3.- cancelada)
* comments --> string (algún pedido especial que tenga el usuario)
* day --> date (fecha de la reserva)
* hour --> time (hora de la reserva)
* peopleCount --> integer (cantidad de personas que vienen con la reserva)

Está conectado a:
* [dish](#dish) mediante [reservationdishes](#reservationdishes)
* [restaurant](#restaurant) (belongsTo)
* [table](#table) mediante [reservationtables](#reservationtables)
* [user](#user) (belongsTo)

## reservationdishes

Contiene los [platos](#dish) solicitados en una [reserva](#reservation)

Posee:
* amount --> integer (cantidad del plato solicitados)
* dishId --> integer
* reservationId --> integer

## reservationtables

Une las [mesas](#table) de un restaurante con una [reserva](#reservation). **Ya no se está trabajando con mesas**

Posee:
* reservationId --> integer
* tableId --> integer

## restaurant

Entidad que representa a un restaurante

Posee:
* id --> integer
* address --> string (direccion del restaurante)
* close_at --> time (hora de cierre)
* commune --> string (comuna)
* image --> string (nombre de la imagen de portada)
* lat --> float (latitud para pin en el mapa)
* lng --> float (longitud para pin en el mapa)
* name --> string (nombre del restaurante)
* nickname --> string(apodo, sirve como identificador único)
* open_at --> time (hora de apertura)
* password --> string (clave, se encripta antes de guardarse)
* phone --> string (numero de telefono)
* score --> float (puntuación promedio dada por los usuarios)
* votes --> float (cantidad de votos recibidos)

Está conectado a:
* [dish](#dish) (hasMany)
* [registration](#registration) (hasOne)
* [review](#review) (hasMany)

## restaurantCategory

Tabla que une las [categorías](#category) a los [restoranes](#restaurant)

Posee:
* categoryId --> integer
* restaurantId --> integer
 
## review

Comentarios que realizan los usuarios respecto algun restoran, existe la opción de escribirlo en formato `.md`

Posee:
* id --> integer
* comment --> text (comentario del usuario)
* markDown --> boolean (si se escribió en markdown o no)
* userName --> string (nombre del usuario)

Está conectado a:
* [restaurant](#restaurant) (belongsTo)
* [user](#user) (belongsTo)

## table

Las mesas de cada restaurant. **Ya no se está trabajando con mesas**

Posee:
* id --> integer
* capacity --> integer (capacidad de cada mesa)

Está conectado a:
* [reservation](#reservation) mediante [reservationtables](#reservationtables)
* [restaurant](#restaurant) (belongsTo)

## user

Representa a un usuario, este puede ser de tipo normal o administrador. En el segundo caso tiene la capacidad de editar algunas cosas y de eliminar todas.

Posee:
* id --> integer
* admin --> boolean (si el usuario es administrador o no)
* birthday --> dateonly (fecha de nacimiento)
* email --> string (correo del usuario, se usa como identificador único)
* image --> string (nombre de la foto de perfil)
* name --> string (nombre del usuario)
* nickname --> string (apodo del usuario)
* password --> string (clave, se encripta antes de guardarse)

Está conectado a:
* [review](#review) (hasMany)
* [reservation](#reservation) (hasMany)
* [registration](#registration) (hasOne)

## userVote

Guarda las puntuaciones que cada [usuario](#user) le ha dado a los [restoranes](#restaurant)

Posee:
* restaurantId --> integer
* scoreData --> integer (puntuación dada al restoran)
* uderId --> integer
 
---
# Routes
 
* [api/review](#api/review) --> CRUD
* [categories](#categories) --> CRUD
* [dishes](#dishes) --> CRUD & link
* [favdishes](#favdishes) --> link
* [favrestaurants](#favrestaurants) --> link
* [hello](#hello) --> correos (inactiva)
* [imageRestaurant](#imageRestaurant) --> CRUD
* [images](#images) --> CRUD
* [index](#index) --> vista inicial
* [maps](#maps) --> vista
* [reservations](#reservations) --> CRUD, vistas & link
* [restaurantCategories](#restaurantCategories) --> link
* [restaurantDishes](#restaurantDishes) --> vista
* [restaurants](#restaurants) --> CRUD & vista
* [returnRestaurant](#returnRestaurant)
* [reviews](#reviews)
* [session](#session)
* [tables](#tables)
* [users](#users)
 
## api/review
 
Controlador encargado de las _reviews_, trabaja en conjunto con [componentes react]() y la api que permite tener markdown. Reemplaza al controlador [reviews](#reviews)
 
Funciones:
* funciones básicas de CRUD recibiendo y mandando los datos a través de react
 
## categories
 
Se realiza el CRUD de las categorías, revisando que los usuarios cumplan con los permisos mínimos. Se crean "en el aire", en [restaurantCategories](#restaurantCategories) se creará el link con los restaurantes
 
Funciones:
* funciones básicas de creación, lectura, edición y eliminación de datos
 
## dishes
 
Se realiza CRUD de los platos de cada restaurante, quedan asociados al momento de la creación. La asociación de los usuario a sus platos favoritos se hace en [favdishes](#favdishes)
 
Funciones:
* funciones básicas de creación, lectura, edición y eliminación de datos
 
## favdishes
 
Se crea el link entre un usuario y un plato que le guste
 
Funciones:
* crear conexion usuario-plato
 
## favrestaurants
 
Se crea el link entre un usuario y un restaurante que le guste
 
Funciones:
* crear conexion usuario-plato
 
## hello
 
Controlador de muestra para mandar mails automático. **No está en uso**
 
## imageRestaurant

Controlador que se encarga de guardar las imagenes "variables" de los restaurantes en la app (fotos de perfil, platos, etc) con la api de cloudinary.
 
Funciones:
* permite subir las fotos de los restaurantes
 
## images

Controlador que se encarga de guardar las fotos de perfil de los usuarios con la api de cloudinary.
 
Funciones:
* permite subir las fotos de los usuarios
 
## index

Es la ruta a la que se dirige inicialmente la app
 
Funciones:
* _renderear_ la página de inicio
 
## maps

Carga los restaurantes para mostrarlos en el mapa
 
Funciones:
* cargar todos los restaurantes y _renderear_ el mapa
 
## reservations

Permite la creación de reservas por parte de un usuario y que éste visualice las que ha realizado
 
Funciones:
* CRUD reservas
* dado un usuario ver sus reservas
* dado una reserva ver el restaurante
* dada una reserva ver el usuario que la creó
 
## restaurantCategories
 
Establece los links entre un restaurante y sus categorías
 
Funciones:
* deslinkear las categorías de un restaurante
* establecer conexiones entre restaurantes y categorías
 
## restaurantDishes

Visualización de los platos de un restaurante
 
Funciones:
* dado un restaurante muestra sus platos
 
## restaurants

Posee las principales funciones de los restaurantes: CRUD, ver las reservas que le han hecho, aceptar o rechazar reservas, un buscador y recibir valoraciones de los usuarios.
 
Funciones:
* CRUD con validacion de campos (asigna posición en el mapa)
* buscar restaurante por nombre
* visualización de las reservas recibidas
* aceptar o rechazar reservas
* recibir valoraciones de usuarios
* editar valoraciones
* redirigir a una nueva reserva
 
## returnRestaurant

Manda los restaurantes a el mapa
 
Funciones:
* enviar restaurantes a la api del mapa
 
## reviews

CRUD de los comentarios de usuarios. **Es reemplazada por [api/review](#api/review)**
 
Funciones:
* CRUD de los comentarios
 
## session

Posee los mecanismos de inicio y cierre de sesión tanto para usuarios como para restaurantes. una vez iniciada la sesión redirige si es posible a la ventana de origen
 
Funciones:
* inicio de sesión para usuarios
* inicio de sesión para restaurantes
* cierre de sesión común
 
## tables

CRUD de las mesas. **YA no se están usando**
 
Funciones:
* CRUD mesas
 
## users

CRUD de usuarios con validación en los campos, permite la visualización del perfil con restaurantes y platos favoritos además de editar su foto de perfil
 
Funciones:
* CRUD usuario (inicia sesión automáticamente)
* visualización del perfil incluyendo sus favoritos
* agregar foto de perfil

