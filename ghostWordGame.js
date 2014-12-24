var ghostGame = angular.module('ghostWordGame', [])
  .controller('GhostController', GhostController);


function GhostController($scope, $http) {
	$scope.currentWord = "";
	$scope.currentWordInDictionary = false;
	
	$scope.dictionary = '';
	$scope.dictionaryBeginIndex = 0;
	$scope.dictionaryEndIndex = 0;
	$scope.viableWords = [];
	$scope.computerWinWords = [];
	
//	$scope.hardMode = $routeParams.param2 ? true: false;
	$scope.hardMode = false;
	$scope.turnTaker = [
		{who: 'I', whose: 'My', class: 'myTurn'},
		{who: 'You', whose: 'Your', class: 'yourTurn'}
	];
	
	$scope.winner='';
	$scope.wordInvalid = false;
	
	$scope.currentTurnTaker = 1;
	$scope.cheat = false;
//	$scope.cheat = $routeParams.param1 ? true : false;
	//fill dictionary
	$http.get('./wordsEn.txt').
		success(function(data) {
			$scope.dictionary = data.split("\n").map(function(word, i, arr){
				return word.trim();
			});
			$scope.dictionaryEndIndex = $scope.dictionary.length;
			console.log('dictionary filled');
		}).
		error(function(data,status,headers,config){			
		});
	
	
	$scope.DictionaryWordCheck = function(){
		$scope.currentWordInDictionary = false;
		var lastWord = $scope.currentWord +'zzz';
		var indexMoved = false;
		for (var i = $scope.dictionaryBeginIndex; i < $scope.dictionaryEndIndex ; i++){
			if ($scope.dictionary[i] < $scope.currentWord) { 
				$scope.dictionaryBeginIndex = i;
				indexMoved = true;
			} 
			else if ($scope.dictionary[i] == $scope.currentWord) $scope.currentWordInDictionary = true;				
			else if ($scope.dictionary[i] > lastWord) {
				$scope.dictionaryEndIndex = i;
				break;
			}
		}
		if (indexMoved) $scope.dictionaryBeginIndex++;		
	}
		
	$scope.setViableWords = function(){
		$scope.DictionaryWordCheck();
		$scope.viableWords =  $scope.dictionary.slice($scope.dictionaryBeginIndex, $scope.dictionaryEndIndex);
	}
		
	$scope.toggleTurn = function(){
		$scope.setViableWords();
		if ($scope.currentWordInDictionary && $scope.currentWord.length > 3) {
			$scope.winner = ($scope.currentTurnTaker) ? 'I win -- yay Computers!!' : 'You win -- one point for humans!';
			return true;
		} else if ($scope.viableWords.length == 0 ) {
			$scope.wordInvalid = true;
			return $scope.wordInvalid;
		}
		$scope.currentTurnTaker = ($scope.currentTurnTaker) ? 0 : 1;
		return false;
	}
	
	$scope.addLetter = function() {
		$scope.currentWord = $scope.currentWord + $scope.newLetter.toLowerCase();
		$scope.newLetter='';
	}
	
	$scope.usersTurn = function() {
		$scope.addLetter();
		if ($scope.toggleTurn()) return;
		$scope.computersTurn();
	}
	
	$scope.computersTurn = function() {
		var wayToWin = false;
		if ($scope.hardMode) {
			$scope.computerWinWords = $scope.viableWords.map(function(word,i,arr) {
				if ( ((word.length - $scope.currentWord.length) % 2 == 0 ) && ($scope.currentWord.length < word.length) && (word.length > 3) ) {
					var containsShorter = false;
					for (var i=3 ; i < word.length - 1 ; i++ ) {
						if ( $scope.viableWords.indexOf( word.slice(0,i+1) ) > -1 ) {
							containsShorter = true;
							break;
						}
					}
					if (!containsShorter) {
						wayToWin = true;
						return word;
					}
				}
			}).filter(function(e){return e});
		}
		$scope.newLetter = (wayToWin) ? $scope.computerWinWords[Math.floor($scope.random(0, $scope.computerWinWords.length))][$scope.currentWord.length] : $scope.dictionary[Math.floor($scope.random($scope.dictionaryBeginIndex+1, $scope.dictionaryEndIndex))][$scope.currentWord.length];
		$scope.addLetter();
		$scope.toggleTurn();
	}
	
	$scope.addRandomLetter = function (possible) {
	    var possible = "abcdefghijklmnopqrstuvwxyz";
	    $scope.newLetter = possible.charAt(Math.floor(Math.random() * possible.length));
		$scope.addLetter();
	}
		
	$scope.random = function (min, max) {
	    return Math.random() * (max - min) + min;
	}

}

angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);