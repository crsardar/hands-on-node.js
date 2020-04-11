# hello-docker-nodejs

A Hello World program for a Dockerized NodeJS application, Using Express.

Steps -

1. Create normal Express application

2. Create Dockerfile with given content

3. Create Docker image -
    
    sudo docker build -t crsardar/hello-docker-nodejs .
    
    // from the dir where th Dockerfile is located
    
4. Run an instance of the Docker image

    sudo docker run -p 8090:8090 -t crsardar/hello-docker-nodejs

   // To release console add " &" at the end
   //Like - "sudo docker run -p 8090:8090 -t crsardar/hello-docker-nodejs &"
    
5. Test - http://localhost:8090/hello-docker-nodejs/

Note: 
	* Before Step 4, Docker Engine should be installed in the system

