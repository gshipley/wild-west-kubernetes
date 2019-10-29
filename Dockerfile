# Start with a base image containing Java runtime
FROM adoptopenjdk/openjdk11:latest

# Add Maintainer Info
LABEL maintainer="gshipley@vmware.com"

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 8080

# The application's jar file
ARG JAR_FILE=target/wildwest-1.0.jar

# Add the application's jar to the container
ADD ${JAR_FILE} wildwest.jar

# Run the jar file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/wildwest.jar"]