FROM maven:3.6.2-jdk-11 as builder
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml clean package
FROM adoptopenjdk/openjdk11:latest as runtime
LABEL maintainer="gshipley@vmware.com"
EXPOSE 8080
COPY --from=builder /usr/src/app/target/wildwest-1.0.jar /usr/app/wildwest.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/usr/app/wildwest.jar"]