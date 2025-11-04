## 📘 Temario – Curso “Arquitecturas de Microservicios”

---

### 🧩 **Módulo 1 – Del Monolito a los Microservicios** *(2h)*

#### 1.1 Conceptos iniciales

* ¿Qué es una arquitectura monolítica?
* Limitaciones comunes: escalado, acoplamiento y mantenimiento.
* Introducción al paradigma distribuido.

#### 1.2 Evolución hacia microservicios

* Motivaciones técnicas y organizativas.
* Principio de responsabilidad única (SRP) en la arquitectura.
* Ventajas y desventajas de la transición.

#### 1.3 Diseño conceptual

* Separación de dominios de negocio.
* Contextos delimitados (*Bounded Contexts*).
* Definición de contratos API entre servicios.

#### 1.4 Práctica LAB1 – “Desacoplando el monolito”

* Crear un monolito Express con endpoints `/users` y `/orders`.
* Separar en dos servicios independientes.
* Probar comunicación REST con Axios.

---

### ⚙️ **Módulo 2 – Comunicación, Descubrimiento y Resiliencia** *(3h)*

#### 2.1 Comunicación entre servicios

* Comunicación síncrona: REST sobre HTTP.
* Comunicación asíncrona: eventos y colas.
* JSON como formato estándar de intercambio.

#### 2.2 Service Discovery

* Problema del direccionamiento dinámico.
* Registro y descubrimiento de servicios (Eureka, Consul).
* Ejemplo simplificado con tabla de servicios estática en Node.js.

#### 2.3 Balanceo y tolerancia a fallos

* Tipos de balanceo (cliente, servidor, DNS).
* Patrón *Circuit Breaker*: detección de errores y fallback.
* Librería `opossum` para Circuit Breaker en Node.js.

#### 2.4 Práctica LAB2 – “Resiliencia aplicada”

* Implementar llamadas entre servicios con Axios.
* Añadir *retry*, *timeout* y *circuit breaker*.
* Simular fallos de un servicio y observar la recuperación.

---

### 🔄 **Módulo 3 – Mensajería Distribuida y Eventos** *(2h)*

#### 3.1 Arquitectura orientada a eventos (EDA)

* Diferencia entre *request/response* y *publish/subscribe*.
* Componentes: productores, consumidores, colas y topics.
* Garantías de entrega (at-least-once, exactly-once).

#### 3.2 Message Broker

* Concepto y rol de un *broker* (RabbitMQ, Kafka).
* Flujo de mensajes en sistemas distribuidos.
* Idempotencia y consistencia eventual.

#### 3.3 Coreografía vs Orquestación

* Diferencia entre coordinación centralizada y descentralizada.
* Patrones de integración por eventos.

#### 3.4 Práctica LAB3 – “Eventos de pedido”

* Ejecutar RabbitMQ en Codespaces con Docker Compose.
* Publicar evento `order.created` desde el servicio `orders`.
* Consumirlo desde `users` y registrar actividad.

---

### 🧠 **Módulo 4 – CQRS y Event Sourcing** *(2h)*

#### 4.1 Separación de comandos y consultas

* Concepto CQRS (*Command Query Responsibility Segregation*).
* Ventajas: optimización de lectura y escritura.
* Casos de uso típicos: informes, auditorías, procesamiento intensivo.

#### 4.2 Event Sourcing (introducción)

* Almacenar cambios como eventos en lugar de estado final.
* Reconstrucción del estado desde el historial.
* Beneficios y retos: trazabilidad, complejidad.

#### 4.3 Práctica LAB4 – “Command vs Query”

* Implementar `POST /orders` (Command) y `GET /orders` (Query) en servicios distintos.
* Generar un evento tras cada inserción.
* Mostrar consistencia eventual mediante logs.

---

### 🛡️ **Módulo 5 – Gateway y Seguridad en Microservicios** *(3h)*

#### 5.1 API Gateway

* Función: punto único de entrada, routing, autenticación.
* Ejemplos: Kong, NGINX, Spring Cloud Gateway, Express Proxy.
* Edge Services y control de tráfico.

#### 5.2 Seguridad distribuida

* Principios: *Zero Trust*, autenticación y autorización distribuida.
* JSON Web Tokens (JWT) como estándar.
* Validación de tokens en cada servicio.

#### 5.3 Gestión de configuración y secretos

* Variables de entorno (.env) y configuración centralizada.
* Principio de *12-Factor App* aplicado a microservicios.

#### 5.4 Práctica LAB5 – “Gateway y autenticación JWT”

* Implementar gateway Express con `http-proxy-middleware`.
* Crear `POST /login` en `users` que emita un JWT.
* Validar token en gateway antes de redirigir a `orders`.

---

### 🧩 **Cierre y Conclusiones (opcional, 15 min)**

* Revisión de los patrones aprendidos.
* Buenas prácticas en despliegue: Docker Compose y Kubernetes.
* Recomendaciones de lectura y herramientas (Istio, Linkerd, Dapr, etc.).