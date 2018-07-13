pragma solidity ^0.4.24;

contract PixelClaimer {
    
    struct Pixel {
        uint i;
        uint j;
        address current_owner;
        uint last_wei_spent;
        uint src;
    }
    
    address private game_owner;
    uint constant private dimension = 20;
    Pixel[20][20] assignments;
    
    constructor () public {
        game_owner = msg.sender;
    }

    function getAssignment(uint i, uint j) public view returns (uint) {
        return assignments[i][j].src;
    }

    function claimPixel(uint i, uint j, uint src) public {
        assignments[i][j].i = i;
        assignments[i][j].j = j;
        assignments[i][j].src = src;
        assignments[i][j].current_owner = msg.sender;
        // assignments[i][j].i = msg.value;
    }
    
}
