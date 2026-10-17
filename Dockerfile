# Etapa 1: Compilar la aplicación con Maven y Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copiar todo el código fuente al contenedor
COPY . .

# Compilar el proyecto directamente con maven
RUN mvn clean package -DskipTests

# Etapa 2: Ejecutar la aplicación ligera con Java 21 JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR generado desde la primera etapa
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]