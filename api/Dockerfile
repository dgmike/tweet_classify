FROM gradle:jdk11 AS build

WORKDIR /api
COPY ./build.gradle ./settings.gradle ./
RUN gradle --no-daemon dependencies

COPY ./ ./
RUN gradle --no-daemon build -Pspeed=true

FROM openjdk:8-jre-alpine

WORKDIR /api
COPY --from=build /api/build/libs/api-0.0.1-SNAPSHOT.jar /api/api.jar
EXPOSE 8080
CMD ["java", "-jar", "/api/api.jar"]
