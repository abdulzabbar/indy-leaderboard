pragma solidity ^0.5.6;

import "./EbakusDB.sol";

contract GameBoard {
	event LogLeaderboard(uint64 _id, string _title, string _image, uint _order);
	event LogAchievement(uint64 _id, string _title, string _image, uint8 _type, uint64 _maxValue);
	event LogBool(bool _value);
	event LogUint8(uint8 _value);

	string LeaderboardsTable = "Leaderboards";
	string AchievementsTable = "Achievements";
	string ScoresTable = "Scores";
	string UnlockedAchievementsTable = "UnlockedAchievements";

	struct Leaderboard {
		uint64 Id;
		string Title;
		string Image;
		uint8 Order; // 0: ASC, 1: DESC
	}

	struct Achievement {
		uint64 Id;
		string Title;
		string Image;
		uint8 Type;  // 0: boolean, 1: progressive
		uint64 MaxValue;
	}

	struct Score {
		string Id;  // userId + leaderboardId
		uint64 LeaderboardId;
		address UserId;
		uint64 Value;
	}

	struct UnlockedAchievement {
		string Id;  // userId + achievementId
		uint64 AchievementId;
		address UserId;
		uint64 Value;
	}

	address private owner;

	modifier onlyOwner() {
		require(msg.sender == owner, "Only owner can call this function.");
		_;
	}

	constructor() public {
		owner = msg.sender;

		string memory leaderboardsTableAbi = '[{"type":"table","name":"Leaderboards","inputs":[{"name":"Id","type":"uint64"},{"name":"Title","type":"string"},{"name":"Image","type":"string"},{"name":"Order","type":"uint8"}]}]';
		EbakusDB.createTable(LeaderboardsTable, "Title", leaderboardsTableAbi);

		string memory achievementsTableAbi = '[{"type":"table","name":"Achievements","inputs":[{"name":"Id","type":"uint64"},{"name":"Title","type":"string"},{"name":"Image","type":"string"},{"name":"Type","type":"uint8"},{"name":"MaxValue","type":"uint64"}]}]';
		EbakusDB.createTable(AchievementsTable, "Title", achievementsTableAbi);

		string memory scoresTableAbi = '[{"type":"table","name":"Scores","inputs":[{"name":"Id","type":"string"},{"name":"LeaderboardId","type":"uint64"},{"name":"UserId","type":"address"},{"name":"Value","type":"uint64"}]}]';
		EbakusDB.createTable(ScoresTable, "Value", scoresTableAbi);

		string memory unlockedAchievementsTableAbi = '[{"type":"table","name":"UnlockedAchievements","inputs":[{"name":"Id","type":"string"},{"name":"AchievementId","type":"uint64"},{"name":"UserId","type":"address"},{"name":"Value","type":"uint64"}]}]';
		EbakusDB.createTable(UnlockedAchievementsTable, "Value", unlockedAchievementsTableAbi);
	}

	// 0, "Hackathon", "IPFS", 0
	function createLeaderboard(uint64 _id, string calldata _title, string calldata _image, uint8 _order) external onlyOwner {
		require(bytes(_title).length < 255);
		require(bytes(_image).length <= 400);
		require(_order <= 1);

		Leaderboard memory l = Leaderboard(_id, _title, _image, _order);
		bytes memory input = abi.encode(l.Id, l.Title, l.Image, l.Order);

		bool ok = EbakusDB.insertObj(LeaderboardsTable, input);
		require(ok);

		emit LogBool(ok);
	}

    // 0, "Hackathon", "IPFS", 0, 200
	function createAchievement(uint64 _id, string calldata _title, string calldata _image, uint8 _type, uint64 _maxValue) external onlyOwner {
		require(bytes(_title).length < 255);
		require(bytes(_image).length <=400);
		require(_type <= 1);

		Achievement memory a = Achievement(_id, _title, _image, _type, _maxValue);

		if (_type == 0) {
			a.MaxValue = 1;
		}

		bytes memory input = abi.encode(a.Id, a.Title, a.Image, a.Type, a.MaxValue);

		bool ok = EbakusDB.insertObj(AchievementsTable, input);
		require(ok);

		emit LogBool(ok);
	}

	function setScore(uint64 _leaderboardId, address _userId, uint64 _value) external onlyOwner {
		// get leaderboard from DB and verify
		Leaderboard memory l;
		(l.Id, l.Title, l.Image, l.Order) = getLeaderboard(_leaderboardId);

		require(l.Id == _leaderboardId);

		string memory id = string(abi.encodePacked(_userId, _leaderboardId));

		Score memory s = Score(id, _leaderboardId, _userId, _value);
		bytes memory input = abi.encode(s.Id, s.LeaderboardId, s.UserId, s.Value);

		bool ok = EbakusDB.insertObj(ScoresTable, input);
		require(ok);

		emit LogBool(ok);
	}


    // 0, 0, 1
	function unlockAchievement(uint64 _achievementId, address _userId, uint64 _value) external onlyOwner {
		// get achivement from DB and verify
		Achievement memory a;
		(a.Id, a.Title, a.Image, a.Type, a.MaxValue) = getAchievement(_achievementId);

		require(a.Id == _achievementId);

		if (a.Type == 0) {
			require(_value <= 1);
		} else {
			require(_value <= a.MaxValue);
		}

		string memory id = string(abi.encodePacked(_userId, _achievementId));

		UnlockedAchievement memory ua = UnlockedAchievement(id, _achievementId, _userId, _value);
		bytes memory input = abi.encode(ua.Id, ua.AchievementId, ua.UserId, ua.Value);

		bool ok = EbakusDB.insertObj(UnlockedAchievementsTable, input);
		require(ok);

		emit LogBool(ok);
	}

	function getLeaderboard(uint64 _id) internal returns (uint64, string memory, string memory, uint8) {
		Leaderboard memory l;
		bytes memory out = EbakusDB.get(LeaderboardsTable, string(abi.encodePacked("Id = ", uint2str(_id))), "");
		(l.Id, l.Title, l.Image, l.Order) = abi.decode(out, (uint64, string, string, uint8));

		emit LogLeaderboard(l.Id, l.Title, l.Image, l.Order);
		return (l.Id, l.Title, l.Image, l.Order);
	}

	function getAchievement(uint64 _id) internal returns (uint64, string memory, string memory, uint8, uint64) {
		Achievement memory a;
		bytes memory out = EbakusDB.get(AchievementsTable, string(abi.encodePacked("Id = ", uint2str(_id))), "");
		(a.Id, a.Title, a.Image, a.Type, a.MaxValue) = abi.decode(out, (uint64, string, string, uint8, uint64));

		emit LogAchievement(a.Id, a.Title, a.Image, a.Type, a.MaxValue);
		return (a.Id, a.Title, a.Image, a.Type, a.MaxValue);
	}

	function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
		if (_i == 0) {
			return "0";
		}
		uint j = _i;
		uint len;
		while (j != 0) {
			len++;
			j /= 10;
		}
		bytes memory bstr = new bytes(len);
		uint k = len - 1;
		while (_i != 0) {
			bstr[k--] = byte(uint8(48 + _i % 10));
			_i /= 10;
		}
		return string(bstr);
	}
}