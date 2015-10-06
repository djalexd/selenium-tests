
$('.digit').click(function() {
    var $e = $('#display');
	$e.val($e.val() + this.value);
});

$('#compute').click(function() {
	var $e = $('#display');
	var expression = $e.val();

	var calculator = new Calculator();
	var result = calculator.compute(expression);

	$e.val(result);
});


var Calculator = function() {
}

/**
 * An expression is composed of digits, fraction separator (.), spaces,
 * operators, paranthesis and custom functions (sqrt, pow, etc).
 *
 * A general expression is EXPR
 * EXPR = EXPR (OP EXPR)* | (EXPR) | FN(EXPR_FN) | NUMBER
 * EXPR_FN = EXPR | [EXPR]
 * OP = + | - | * | / | %
 * NUMBER = SIGN DIGIT*.DIGIT*
 * DIGIT = 0-9
 * SIGN = '' | '-'
 */
Calculator.prototype.compute = function(expression) {
	var computeTree = function(expression) {
		// (sqrt(2.1) - 1)*5.2 = [ '(', 'sqrt', '(', '2.1', ')', '-', '1', ')', '*', '5.2' ]
		// '(' -> BracketOpen
		// 'sqrt' -> fn
		// '(' -> FnOpen
		// '2.1' -> x1 = ComputeNode('number', 2.1)
		// ')' -> FnClose
		// ---> x2 = ComputeNode('fn', 'sqrt', [x1])
		// '-' -> op
		// '1' -> x3 = ComputeNode('number', 1)
		// ')' -> BracketClose
		// ---> x4 = ComputeNode('op', '-', [x2, x3])
		// '*' -> op
		// '5.2' -> x5 = ComputeNode('number', 5.2)
		// Finish
		// ---> x6 = ComputeNode('op', '*', [x4, 5])

		function extractNumber(fromString, index) {
			var ch = fromString.chatAt(index), numbers='1234567890';
			if (numbers.indexOf(ch) >= 0 || ch == '-') {
				// Look for next non-number character (can be anything but
				// numbers or '.'
				var j = i + 1;
				while(numbers.indexOf(fromString.chatAt(j)) >= 0 ||
				      fromString.chatAt(j) == '.' &&
				      j < fromString.length) {
				      j++;
				}

				return fromString.substring(index, j);
			}

			throw "NotANumber";
		}

		function extractFunction(fromString, index) {
			var ch = fromString.chatAt(index), functions='qwertyuiopasdfghjklzxcvbnm';

			var j = i + 1;
			while (functions.indexOf(fromString.chatAt(j)) >= 0 &&
					j < fromString.length) {
				j++;
			}

			return fromString.substring(index, j);
		}

		// Placeholder objects
        var BracketOpen = {}
        var BracketClose = {}

		var tokens = [], passThroughCharacters = '()+-*/,', numbers='1234567890', functions='qwertyuiopasdfghjklzxcvbnm';
		for (var i = 0; i < expression.length; i++) {
			var ch = expression.chatAt(i);
			if (ch == ' ') {
				// Skip
				continue;
			} else if (passThroughCharacters.indexOf(ch) >= 0) {
				// TODO Fix negative numbers here.
				tokens.push(ch);
			} else if (numbers.indexOf(ch) >= 0) {
				var numberAsString = extractNumber(expression, i);
				tokens.push(numberAsString);
				i += numberAsString.length;
			} else if (functions.indexOf(ch) >= 0) {
				var functionAsString = extractFunction(expression, i);
			} else {
				throw "Unknown character '" + ch + "' found at index " + i;
			}
		}

		var stack = new Stack();
		for (var i = 0; i < tokens.length; i++) {

		}
	}

	var head = computeTree(expression);
	return head.getValue();
}

var Stack = function() {
	this.stack = [];
}

Stack.prototype.push = function(v) {
	this.stack.push(v);
}

Stack.prototype.pop = function() {
	if (this.stack.length == 0) {
		throw "Stack is empty";
	}
	var v = this.stack[this.stack.length - 1];
	this.stack = this.stack.splice(this.stack.length - 2, 1);
	return v;
}

Stack.prototype.size() = function() {
	return this.stack.length;
}

var ComputeNode = function(type, data, children) {
	this.type = type;
	this.data = data;
	this.children = children;
}

ComputeNode.prototype.getValue = function() {
	if (this.type === 'number') {
		return parseFloat(this.data);
	} else if (this.type === 'fn') {
		// TODO fix this
	} else if (this.type === 'op') {
		// always 2 children
		if (this.children === undefined || this.children.length != 2) {
			throw "Tree does not have 2 children but: " + this.children.length;
		}
		var op = this.data;
		if (op === '+') {
			return this.children[0].getValue() + this.children[1].getValue();
		} else if (op === '-') {
			return this.children[0].getValue() - this.children[1].getValue();
		} else if (op === '*') {
			return this.children[0].getValue() * this.children[1].getValue();
		} else if (op === '/') {
			return this.children[0].getValue() / this.children[1].getValue();
		} else {
			throw "Unknown op: " + op;
		}
	} else if (this.type === 'brackets') {
		// always 1 children
    	if (this.children === undefined || this.children.length != 1) {
    		throw "Tree does not have 1 child but: " + this.children.length;
    	}
		return this.children[0].getValue();
	} else {
		throw "Unknown node type: " + this.type;
	}
}