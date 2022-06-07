//pragma solidity >=0.4.22 <0.8.0;
pragma solidity >=0.4.22 <0.9.0;



contract Election {
    
    struct Candidate { //Candidate structure
        int id;
        string name;
        int voteCount;
    }
    
    string public election_name= "Who is the best football player of all time?";
    
    // Store Candidates Count
    int public candidatesCount;

    // Store accounts that have voted
    mapping(address => bool) public hasVoted;
    // Store Candidates
    // Fetch Candidate
    mapping(int => Candidate) public candidates;
    

    // voted event
    event votedEvent (
        int indexed _candidateId
    );

    constructor () public {
        
        candidatesCount=0;
        addCandidate("Edson Arantes do Nascimento Pele");
        addCandidate("Diego Armando Maradona");
        addCandidate("Lionel Andres Messi");
    }


    function addCandidate (string memory _name) public {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
    
    

    
    function vote (int _candidateId) public {
        // if they haven't voted before, proceed
        require(!hasVoted[msg.sender]);    // [msg.sender is sender of the transc.

        // if a valid candidate, proceed
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // mark that voter has voted
        hasVoted[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
    
    
   
   
    //   function returnCandidates() public view returns(mapping) {
          
    //      return candidates;
    //   }
    
    
}