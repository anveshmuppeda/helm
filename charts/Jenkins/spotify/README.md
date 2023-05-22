# Spotify
Core System
You have been tasked to build a new SaaS aiming to dethrone Spotify. The ask is to build a microservices
based system that will allow the users to perform several tasks on the music domain:  
1. The users should be able to login into the system. This micro service is ready I will provide code.  
2. The users should be able to search songs by title or, in general, any of the metadata fields of the
stored MP3 files.   
3. The users should be able to create playlists.  
4. The users should be able to play songs.  
5. An operator should be able to add songs on the fly, making them appear automatically in
searches performed by the users.  
->The system should have a basic UI. It should be minimal as it is not going to be marked.
In order to achieve these tasks, a set of microservices should be created using Docker and integrated into a Kubernetes cluster in a resilient way. As the time is limited, you will need to rely on third party systems like
(but not limited to):  
- MinIO. 
- database systems like MySQL, MongoDB…. 
The system can be built using whatever architecture you decide is the most appropriate but has to meet
certain requirements:  
- Needs to be containerized.  
- Should be deployable in Kubernetes with minimum work.  
- Must be well documented.  

Deliverables
I am expecting: 
- The source code for the system.
 - The Kubernetes Helm Chart + Dockerfiles to deploy the system. 
- Documentation to run the system and justification of design decisions alongside challenges encountered.
