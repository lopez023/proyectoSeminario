# Etapa 1: Compilar la aplicación con Maven
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar los archivos de configuración y código fuente
COPY . .

# Dar permisos de ejecución al mvnw y compilar el proyecto
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecutar la aplicación ligera
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el JAR generado desde la primera etapa
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]