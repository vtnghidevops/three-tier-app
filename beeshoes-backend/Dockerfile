# Stage 1: Build .jar file
FROM maven:3.9.9-amazoncorretto-17-alpine AS builder
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests=true

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
RUN adduser -D beeshoes

WORKDIR /run
COPY --from=builder /app/target/bee-shoes-backend-0.0.1-SNAPSHOT.jar /run/

RUN chown -R beeshoes:beeshoes /run
USER beeshoes

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "bee-shoes-backend-0.0.1-SNAPSHOT.jar", "--spring.config.location=/run/src/main/resources/application.properties"]

