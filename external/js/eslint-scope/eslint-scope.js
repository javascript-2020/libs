var scope = (function () {
	'use strict';

	/**
	 * @fileoverview Assertion utilities.
	 * @author Nicholas C. Zakas
	 */

	/**
	 * Throws an error if the given condition is not truthy.
	 * @param {boolean} condition The condition to check.
	 * @param {string} message The message to include with the error.
	 * @returns {void}
	 * @throws {Error} When the condition is not truthy.
	 */
	function assert(condition, message = "Assertion failed.") {
		if (!condition) {
			throw new Error(message);
		}
	}

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var estraverse$1 = {};

	/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	var hasRequiredEstraverse;

	function requireEstraverse () {
		if (hasRequiredEstraverse) return estraverse$1;
		hasRequiredEstraverse = 1;
		(function (exports$1) {
			/*jslint vars:false, bitwise:true*/
			/*jshint indent:4*/
			/*global exports:true*/
			(function clone(exports$1) {

			    var Syntax,
			        VisitorOption,
			        VisitorKeys,
			        BREAK,
			        SKIP,
			        REMOVE;

			    function deepCopy(obj) {
			        var ret = {}, key, val;
			        for (key in obj) {
			            if (obj.hasOwnProperty(key)) {
			                val = obj[key];
			                if (typeof val === 'object' && val !== null) {
			                    ret[key] = deepCopy(val);
			                } else {
			                    ret[key] = val;
			                }
			            }
			        }
			        return ret;
			    }

			    // based on LLVM libc++ upper_bound / lower_bound
			    // MIT License

			    function upperBound(array, func) {
			        var diff, len, i, current;

			        len = array.length;
			        i = 0;

			        while (len) {
			            diff = len >>> 1;
			            current = i + diff;
			            if (func(array[current])) {
			                len = diff;
			            } else {
			                i = current + 1;
			                len -= diff + 1;
			            }
			        }
			        return i;
			    }

			    Syntax = {
			        AssignmentExpression: 'AssignmentExpression',
			        AssignmentPattern: 'AssignmentPattern',
			        ArrayExpression: 'ArrayExpression',
			        ArrayPattern: 'ArrayPattern',
			        ArrowFunctionExpression: 'ArrowFunctionExpression',
			        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
			        BlockStatement: 'BlockStatement',
			        BinaryExpression: 'BinaryExpression',
			        BreakStatement: 'BreakStatement',
			        CallExpression: 'CallExpression',
			        CatchClause: 'CatchClause',
			        ChainExpression: 'ChainExpression',
			        ClassBody: 'ClassBody',
			        ClassDeclaration: 'ClassDeclaration',
			        ClassExpression: 'ClassExpression',
			        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: 'ConditionalExpression',
			        ContinueStatement: 'ContinueStatement',
			        DebuggerStatement: 'DebuggerStatement',
			        DirectiveStatement: 'DirectiveStatement',
			        DoWhileStatement: 'DoWhileStatement',
			        EmptyStatement: 'EmptyStatement',
			        ExportAllDeclaration: 'ExportAllDeclaration',
			        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
			        ExportNamedDeclaration: 'ExportNamedDeclaration',
			        ExportSpecifier: 'ExportSpecifier',
			        ExpressionStatement: 'ExpressionStatement',
			        ForStatement: 'ForStatement',
			        ForInStatement: 'ForInStatement',
			        ForOfStatement: 'ForOfStatement',
			        FunctionDeclaration: 'FunctionDeclaration',
			        FunctionExpression: 'FunctionExpression',
			        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
			        Identifier: 'Identifier',
			        IfStatement: 'IfStatement',
			        ImportExpression: 'ImportExpression',
			        ImportDeclaration: 'ImportDeclaration',
			        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
			        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
			        ImportSpecifier: 'ImportSpecifier',
			        Literal: 'Literal',
			        LabeledStatement: 'LabeledStatement',
			        LogicalExpression: 'LogicalExpression',
			        MemberExpression: 'MemberExpression',
			        MetaProperty: 'MetaProperty',
			        MethodDefinition: 'MethodDefinition',
			        ModuleSpecifier: 'ModuleSpecifier',
			        NewExpression: 'NewExpression',
			        ObjectExpression: 'ObjectExpression',
			        ObjectPattern: 'ObjectPattern',
			        PrivateIdentifier: 'PrivateIdentifier',
			        Program: 'Program',
			        Property: 'Property',
			        PropertyDefinition: 'PropertyDefinition',
			        RestElement: 'RestElement',
			        ReturnStatement: 'ReturnStatement',
			        SequenceExpression: 'SequenceExpression',
			        SpreadElement: 'SpreadElement',
			        Super: 'Super',
			        SwitchStatement: 'SwitchStatement',
			        SwitchCase: 'SwitchCase',
			        TaggedTemplateExpression: 'TaggedTemplateExpression',
			        TemplateElement: 'TemplateElement',
			        TemplateLiteral: 'TemplateLiteral',
			        ThisExpression: 'ThisExpression',
			        ThrowStatement: 'ThrowStatement',
			        TryStatement: 'TryStatement',
			        UnaryExpression: 'UnaryExpression',
			        UpdateExpression: 'UpdateExpression',
			        VariableDeclaration: 'VariableDeclaration',
			        VariableDeclarator: 'VariableDeclarator',
			        WhileStatement: 'WhileStatement',
			        WithStatement: 'WithStatement',
			        YieldExpression: 'YieldExpression'
			    };

			    VisitorKeys = {
			        AssignmentExpression: ['left', 'right'],
			        AssignmentPattern: ['left', 'right'],
			        ArrayExpression: ['elements'],
			        ArrayPattern: ['elements'],
			        ArrowFunctionExpression: ['params', 'body'],
			        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
			        BlockStatement: ['body'],
			        BinaryExpression: ['left', 'right'],
			        BreakStatement: ['label'],
			        CallExpression: ['callee', 'arguments'],
			        CatchClause: ['param', 'body'],
			        ChainExpression: ['expression'],
			        ClassBody: ['body'],
			        ClassDeclaration: ['id', 'superClass', 'body'],
			        ClassExpression: ['id', 'superClass', 'body'],
			        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
			        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        ConditionalExpression: ['test', 'consequent', 'alternate'],
			        ContinueStatement: ['label'],
			        DebuggerStatement: [],
			        DirectiveStatement: [],
			        DoWhileStatement: ['body', 'test'],
			        EmptyStatement: [],
			        ExportAllDeclaration: ['source'],
			        ExportDefaultDeclaration: ['declaration'],
			        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
			        ExportSpecifier: ['exported', 'local'],
			        ExpressionStatement: ['expression'],
			        ForStatement: ['init', 'test', 'update', 'body'],
			        ForInStatement: ['left', 'right', 'body'],
			        ForOfStatement: ['left', 'right', 'body'],
			        FunctionDeclaration: ['id', 'params', 'body'],
			        FunctionExpression: ['id', 'params', 'body'],
			        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
			        Identifier: [],
			        IfStatement: ['test', 'consequent', 'alternate'],
			        ImportExpression: ['source'],
			        ImportDeclaration: ['specifiers', 'source'],
			        ImportDefaultSpecifier: ['local'],
			        ImportNamespaceSpecifier: ['local'],
			        ImportSpecifier: ['imported', 'local'],
			        Literal: [],
			        LabeledStatement: ['label', 'body'],
			        LogicalExpression: ['left', 'right'],
			        MemberExpression: ['object', 'property'],
			        MetaProperty: ['meta', 'property'],
			        MethodDefinition: ['key', 'value'],
			        ModuleSpecifier: [],
			        NewExpression: ['callee', 'arguments'],
			        ObjectExpression: ['properties'],
			        ObjectPattern: ['properties'],
			        PrivateIdentifier: [],
			        Program: ['body'],
			        Property: ['key', 'value'],
			        PropertyDefinition: ['key', 'value'],
			        RestElement: [ 'argument' ],
			        ReturnStatement: ['argument'],
			        SequenceExpression: ['expressions'],
			        SpreadElement: ['argument'],
			        Super: [],
			        SwitchStatement: ['discriminant', 'cases'],
			        SwitchCase: ['test', 'consequent'],
			        TaggedTemplateExpression: ['tag', 'quasi'],
			        TemplateElement: [],
			        TemplateLiteral: ['quasis', 'expressions'],
			        ThisExpression: [],
			        ThrowStatement: ['argument'],
			        TryStatement: ['block', 'handler', 'finalizer'],
			        UnaryExpression: ['argument'],
			        UpdateExpression: ['argument'],
			        VariableDeclaration: ['declarations'],
			        VariableDeclarator: ['id', 'init'],
			        WhileStatement: ['test', 'body'],
			        WithStatement: ['object', 'body'],
			        YieldExpression: ['argument']
			    };

			    // unique id
			    BREAK = {};
			    SKIP = {};
			    REMOVE = {};

			    VisitorOption = {
			        Break: BREAK,
			        Skip: SKIP,
			        Remove: REMOVE
			    };

			    function Reference(parent, key) {
			        this.parent = parent;
			        this.key = key;
			    }

			    Reference.prototype.replace = function replace(node) {
			        this.parent[this.key] = node;
			    };

			    Reference.prototype.remove = function remove() {
			        if (Array.isArray(this.parent)) {
			            this.parent.splice(this.key, 1);
			            return true;
			        } else {
			            this.replace(null);
			            return false;
			        }
			    };

			    function Element(node, path, wrap, ref) {
			        this.node = node;
			        this.path = path;
			        this.wrap = wrap;
			        this.ref = ref;
			    }

			    function Controller() { }

			    // API:
			    // return property path array from root to current node
			    Controller.prototype.path = function path() {
			        var i, iz, j, jz, result, element;

			        function addToPath(result, path) {
			            if (Array.isArray(path)) {
			                for (j = 0, jz = path.length; j < jz; ++j) {
			                    result.push(path[j]);
			                }
			            } else {
			                result.push(path);
			            }
			        }

			        // root node
			        if (!this.__current.path) {
			            return null;
			        }

			        // first node is sentinel, second node is root element
			        result = [];
			        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
			            element = this.__leavelist[i];
			            addToPath(result, element.path);
			        }
			        addToPath(result, this.__current.path);
			        return result;
			    };

			    // API:
			    // return type of current node
			    Controller.prototype.type = function () {
			        var node = this.current();
			        return node.type || this.__current.wrap;
			    };

			    // API:
			    // return array of parent elements
			    Controller.prototype.parents = function parents() {
			        var i, iz, result;

			        // first node is sentinel
			        result = [];
			        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
			            result.push(this.__leavelist[i].node);
			        }

			        return result;
			    };

			    // API:
			    // return current node
			    Controller.prototype.current = function current() {
			        return this.__current.node;
			    };

			    Controller.prototype.__execute = function __execute(callback, element) {
			        var previous, result;

			        result = undefined;

			        previous  = this.__current;
			        this.__current = element;
			        this.__state = null;
			        if (callback) {
			            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
			        }
			        this.__current = previous;

			        return result;
			    };

			    // API:
			    // notify control skip / break
			    Controller.prototype.notify = function notify(flag) {
			        this.__state = flag;
			    };

			    // API:
			    // skip child nodes of current node
			    Controller.prototype.skip = function () {
			        this.notify(SKIP);
			    };

			    // API:
			    // break traversals
			    Controller.prototype['break'] = function () {
			        this.notify(BREAK);
			    };

			    // API:
			    // remove node
			    Controller.prototype.remove = function () {
			        this.notify(REMOVE);
			    };

			    Controller.prototype.__initialize = function(root, visitor) {
			        this.visitor = visitor;
			        this.root = root;
			        this.__worklist = [];
			        this.__leavelist = [];
			        this.__current = null;
			        this.__state = null;
			        this.__fallback = null;
			        if (visitor.fallback === 'iteration') {
			            this.__fallback = Object.keys;
			        } else if (typeof visitor.fallback === 'function') {
			            this.__fallback = visitor.fallback;
			        }

			        this.__keys = VisitorKeys;
			        if (visitor.keys) {
			            this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
			        }
			    };

			    function isNode(node) {
			        if (node == null) {
			            return false;
			        }
			        return typeof node === 'object' && typeof node.type === 'string';
			    }

			    function isProperty(nodeType, key) {
			        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
			    }
			  
			    function candidateExistsInLeaveList(leavelist, candidate) {
			        for (var i = leavelist.length - 1; i >= 0; --i) {
			            if (leavelist[i].node === candidate) {
			                return true;
			            }
			        }
			        return false;
			    }

			    Controller.prototype.traverse = function traverse(root, visitor) {
			        var worklist,
			            leavelist,
			            element,
			            node,
			            nodeType,
			            ret,
			            key,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel;

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        worklist.push(new Element(root, null, null, null));
			        leavelist.push(new Element(null, null, null, null));

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                ret = this.__execute(visitor.leave, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }
			                continue;
			            }

			            if (element.node) {

			                ret = this.__execute(visitor.enter, element);

			                if (this.__state === BREAK || ret === BREAK) {
			                    return;
			                }

			                worklist.push(sentinel);
			                leavelist.push(element);

			                if (this.__state === SKIP || ret === SKIP) {
			                    continue;
			                }

			                node = element.node;
			                nodeType = node.type || element.wrap;
			                candidates = this.__keys[nodeType];
			                if (!candidates) {
			                    if (this.__fallback) {
			                        candidates = this.__fallback(node);
			                    } else {
			                        throw new Error('Unknown node type ' + nodeType + '.');
			                    }
			                }

			                current = candidates.length;
			                while ((current -= 1) >= 0) {
			                    key = candidates[current];
			                    candidate = node[key];
			                    if (!candidate) {
			                        continue;
			                    }

			                    if (Array.isArray(candidate)) {
			                        current2 = candidate.length;
			                        while ((current2 -= 1) >= 0) {
			                            if (!candidate[current2]) {
			                                continue;
			                            }

			                            if (candidateExistsInLeaveList(leavelist, candidate[current2])) {
			                              continue;
			                            }

			                            if (isProperty(nodeType, candidates[current])) {
			                                element = new Element(candidate[current2], [key, current2], 'Property', null);
			                            } else if (isNode(candidate[current2])) {
			                                element = new Element(candidate[current2], [key, current2], null, null);
			                            } else {
			                                continue;
			                            }
			                            worklist.push(element);
			                        }
			                    } else if (isNode(candidate)) {
			                        if (candidateExistsInLeaveList(leavelist, candidate)) {
			                          continue;
			                        }

			                        worklist.push(new Element(candidate, key, null, null));
			                    }
			                }
			            }
			        }
			    };

			    Controller.prototype.replace = function replace(root, visitor) {
			        var worklist,
			            leavelist,
			            node,
			            nodeType,
			            target,
			            element,
			            current,
			            current2,
			            candidates,
			            candidate,
			            sentinel,
			            outer,
			            key;

			        function removeElem(element) {
			            var i,
			                key,
			                nextElem,
			                parent;

			            if (element.ref.remove()) {
			                // When the reference is an element of an array.
			                key = element.ref.key;
			                parent = element.ref.parent;

			                // If removed from array, then decrease following items' keys.
			                i = worklist.length;
			                while (i--) {
			                    nextElem = worklist[i];
			                    if (nextElem.ref && nextElem.ref.parent === parent) {
			                        if  (nextElem.ref.key < key) {
			                            break;
			                        }
			                        --nextElem.ref.key;
			                    }
			                }
			            }
			        }

			        this.__initialize(root, visitor);

			        sentinel = {};

			        // reference
			        worklist = this.__worklist;
			        leavelist = this.__leavelist;

			        // initialize
			        outer = {
			            root: root
			        };
			        element = new Element(root, null, null, new Reference(outer, 'root'));
			        worklist.push(element);
			        leavelist.push(element);

			        while (worklist.length) {
			            element = worklist.pop();

			            if (element === sentinel) {
			                element = leavelist.pop();

			                target = this.__execute(visitor.leave, element);

			                // node may be replaced with null,
			                // so distinguish between undefined and null in this place
			                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                    // replace
			                    element.ref.replace(target);
			                }

			                if (this.__state === REMOVE || target === REMOVE) {
			                    removeElem(element);
			                }

			                if (this.__state === BREAK || target === BREAK) {
			                    return outer.root;
			                }
			                continue;
			            }

			            target = this.__execute(visitor.enter, element);

			            // node may be replaced with null,
			            // so distinguish between undefined and null in this place
			            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
			                // replace
			                element.ref.replace(target);
			                element.node = target;
			            }

			            if (this.__state === REMOVE || target === REMOVE) {
			                removeElem(element);
			                element.node = null;
			            }

			            if (this.__state === BREAK || target === BREAK) {
			                return outer.root;
			            }

			            // node may be null
			            node = element.node;
			            if (!node) {
			                continue;
			            }

			            worklist.push(sentinel);
			            leavelist.push(element);

			            if (this.__state === SKIP || target === SKIP) {
			                continue;
			            }

			            nodeType = node.type || element.wrap;
			            candidates = this.__keys[nodeType];
			            if (!candidates) {
			                if (this.__fallback) {
			                    candidates = this.__fallback(node);
			                } else {
			                    throw new Error('Unknown node type ' + nodeType + '.');
			                }
			            }

			            current = candidates.length;
			            while ((current -= 1) >= 0) {
			                key = candidates[current];
			                candidate = node[key];
			                if (!candidate) {
			                    continue;
			                }

			                if (Array.isArray(candidate)) {
			                    current2 = candidate.length;
			                    while ((current2 -= 1) >= 0) {
			                        if (!candidate[current2]) {
			                            continue;
			                        }
			                        if (isProperty(nodeType, candidates[current])) {
			                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
			                        } else if (isNode(candidate[current2])) {
			                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
			                        } else {
			                            continue;
			                        }
			                        worklist.push(element);
			                    }
			                } else if (isNode(candidate)) {
			                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
			                }
			            }
			        }

			        return outer.root;
			    };

			    function traverse(root, visitor) {
			        var controller = new Controller();
			        return controller.traverse(root, visitor);
			    }

			    function replace(root, visitor) {
			        var controller = new Controller();
			        return controller.replace(root, visitor);
			    }

			    function extendCommentRange(comment, tokens) {
			        var target;

			        target = upperBound(tokens, function search(token) {
			            return token.range[0] > comment.range[0];
			        });

			        comment.extendedRange = [comment.range[0], comment.range[1]];

			        if (target !== tokens.length) {
			            comment.extendedRange[1] = tokens[target].range[0];
			        }

			        target -= 1;
			        if (target >= 0) {
			            comment.extendedRange[0] = tokens[target].range[1];
			        }

			        return comment;
			    }

			    function attachComments(tree, providedComments, tokens) {
			        // At first, we should calculate extended comment ranges.
			        var comments = [], comment, len, i, cursor;

			        if (!tree.range) {
			            throw new Error('attachComments needs range information');
			        }

			        // tokens array is empty, we attach comments to tree as 'leadingComments'
			        if (!tokens.length) {
			            if (providedComments.length) {
			                for (i = 0, len = providedComments.length; i < len; i += 1) {
			                    comment = deepCopy(providedComments[i]);
			                    comment.extendedRange = [0, tree.range[0]];
			                    comments.push(comment);
			                }
			                tree.leadingComments = comments;
			            }
			            return tree;
			        }

			        for (i = 0, len = providedComments.length; i < len; i += 1) {
			            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
			        }

			        // This is based on John Freeman's implementation.
			        cursor = 0;
			        traverse(tree, {
			            enter: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (comment.extendedRange[1] > node.range[0]) {
			                        break;
			                    }

			                    if (comment.extendedRange[1] === node.range[0]) {
			                        if (!node.leadingComments) {
			                            node.leadingComments = [];
			                        }
			                        node.leadingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        cursor = 0;
			        traverse(tree, {
			            leave: function (node) {
			                var comment;

			                while (cursor < comments.length) {
			                    comment = comments[cursor];
			                    if (node.range[1] < comment.extendedRange[0]) {
			                        break;
			                    }

			                    if (node.range[1] === comment.extendedRange[0]) {
			                        if (!node.trailingComments) {
			                            node.trailingComments = [];
			                        }
			                        node.trailingComments.push(comment);
			                        comments.splice(cursor, 1);
			                    } else {
			                        cursor += 1;
			                    }
			                }

			                // already out of owned node
			                if (cursor === comments.length) {
			                    return VisitorOption.Break;
			                }

			                if (comments[cursor].extendedRange[0] > node.range[1]) {
			                    return VisitorOption.Skip;
			                }
			            }
			        });

			        return tree;
			    }

			    exports$1.Syntax = Syntax;
			    exports$1.traverse = traverse;
			    exports$1.replace = replace;
			    exports$1.attachComments = attachComments;
			    exports$1.VisitorKeys = VisitorKeys;
			    exports$1.VisitorOption = VisitorOption;
			    exports$1.Controller = Controller;
			    exports$1.cloneEnvironment = function () { return clone({}); };

			    return exports$1;
			}(exports$1));
			/* vim: set sw=4 ts=4 et tw=80 : */ 
		} (estraverse$1));
		return estraverse$1;
	}

	var estraverseExports = requireEstraverse();
	var estraverse = /*@__PURE__*/getDefaultExportFromCjs(estraverseExports);

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/** @import * as types from "eslint-scope" */

	const READ = 0x1;
	const WRITE = 0x2;
	const RW = READ | WRITE;

	/**
	 * A Reference represents a single occurrence of an identifier in code.
	 * @constructor Reference
	 * @implements {types.Reference}
	 */
	class Reference {
		constructor(
			ident,
			scope,
			flag,
			writeExpr,
			maybeImplicitGlobal,
			partial,
			init,
		) {
			/**
			 * Identifier syntax node.
			 * @member {espreeIdentifier} Reference#identifier
			 */
			this.identifier = ident;

			/**
			 * Reference to the enclosing Scope.
			 * @member {Scope} Reference#from
			 */
			this.from = scope;

			/**
			 * Whether the reference comes from a dynamic scope (such as 'eval',
			 * 'with', etc.), and may be trapped by dynamic scopes.
			 * @member {boolean} Reference#tainted
			 */
			this.tainted = false;

			/**
			 * The variable this reference is resolved with.
			 * @member {Variable} Reference#resolved
			 */
			this.resolved = null;

			/**
			 * The read-write mode of the reference. (Value is one of {@link
			 * Reference.READ}, {@link Reference.RW}, {@link Reference.WRITE}).
			 * @member {number} Reference#flag
			 */
			this.flag = flag;
			if (this.isWrite()) {
				/**
				 * If reference is writeable, this is the tree being written to it.
				 * @member {espreeNode} Reference#writeExpr
				 */
				this.writeExpr = writeExpr;

				/**
				 * Whether the Reference might refer to a partial value of writeExpr.
				 * @member {boolean} Reference#partial
				 */
				this.partial = partial;

				/**
				 * Whether the Reference is to write of initialization.
				 * @member {boolean} Reference#init
				 */
				this.init = init;
			}
			this.__maybeImplicitGlobal = maybeImplicitGlobal;
		}

		/**
		 * Whether the reference is static.
		 * @function Reference#isStatic
		 * @returns {boolean} static
		 */
		isStatic() {
			return (
				!this.tainted && !!this.resolved && this.resolved.scope.isStatic()
			);
		}

		/**
		 * Whether the reference is writeable.
		 * @function Reference#isWrite
		 * @returns {boolean} write
		 */
		isWrite() {
			return !!(this.flag & Reference.WRITE);
		}

		/**
		 * Whether the reference is readable.
		 * @function Reference#isRead
		 * @returns {boolean} read
		 */
		isRead() {
			return !!(this.flag & Reference.READ);
		}

		/**
		 * Whether the reference is read-only.
		 * @function Reference#isReadOnly
		 * @returns {boolean} read only
		 */
		isReadOnly() {
			return this.flag === Reference.READ;
		}

		/**
		 * Whether the reference is write-only.
		 * @function Reference#isWriteOnly
		 * @returns {boolean} write only
		 */
		isWriteOnly() {
			return this.flag === Reference.WRITE;
		}

		/**
		 * Whether the reference is read-write.
		 * @function Reference#isReadWrite
		 * @returns {boolean} read write
		 */
		isReadWrite() {
			return this.flag === Reference.RW;
		}
	}

	/**
	 * @constant Reference.READ
	 */
	Reference.READ = READ;

	/**
	 * @constant Reference.WRITE
	 */
	Reference.WRITE = WRITE;

	/**
	 * @constant Reference.RW
	 */
	Reference.RW = RW;

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/** @import * as types from "eslint-scope" */
	/** @import Reference from "./reference.js" */

	/**
	 * A Variable represents a locally scoped identifier. These include arguments to
	 * functions.
	 * @constructor Variable
	 * @implements {types.Variable}
	 */
	class Variable {
		constructor(name, scope) {
			/**
			 * The variable name, as given in the source code.
			 * @member {string} Variable#name
			 */
			this.name = name;

			/**
			 * List of defining occurrences of this variable (like in 'var ...'
			 * statements or as parameter), as AST nodes.
			 * @member {espree.Identifier[]} Variable#identifiers
			 */
			this.identifiers = [];

			/**
			 * List of {@link Reference|references} of this variable (excluding parameter entries)
			 * in its defining scope and all nested scopes. For defining
			 * occurrences only see {@link Variable#defs}.
			 * @member {Reference[]} Variable#references
			 */
			this.references = [];

			/**
			 * List of defining occurrences of this variable (like in 'var ...'
			 * statements or as parameter), as custom objects.
			 * @member {Definition[]} Variable#defs
			 */
			this.defs = [];

			this.tainted = false;

			/**
			 * Whether this is a stack variable.
			 * @member {boolean} Variable#stack
			 */
			this.stack = true;

			/**
			 * Reference to the enclosing Scope.
			 * @member {Scope} Variable#scope
			 */
			this.scope = scope;
		}
	}

	Variable.CatchClause = "CatchClause";
	Variable.Parameter = "Parameter";
	Variable.FunctionName = "FunctionName";
	Variable.ClassName = "ClassName";
	Variable.Variable = "Variable";
	Variable.ImportBinding = "ImportBinding";
	Variable.ImplicitGlobalVariable = "ImplicitGlobalVariable";

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import * as types from "eslint-scope" */

	// Cannot implement `types.Definition` directly because it contains a union.
	/**
	 * @constructor Definition
	 * @implements {Omit<types.Definition, never>}
	 */
	class Definition {
		constructor(type, name, node, parent, index, kind) {
			/**
			 * @member {string} Definition#type - type of the occurrence (e.g. "Parameter", "Variable", ...).
			 */
			this.type = type;

			/**
			 * @member {espree.Identifier} Definition#name - the identifier AST node of the occurrence.
			 */
			this.name = name;

			/**
			 * @member {espree.Node} Definition#node - the enclosing node of the identifier.
			 */
			this.node = node;

			/**
			 * @member {espree.Node?} Definition#parent - the enclosing statement node of the identifier.
			 */
			this.parent = parent;

			/**
			 * @member {number?} Definition#index - the index in the declaration statement.
			 */
			this.index = index;

			/**
			 * @member {string?} Definition#kind - the kind of the declaration statement.
			 */
			this.kind = kind;
		}
	}

	/**
	 * @constructor ParameterDefinition
	 */
	class ParameterDefinition extends Definition {
		constructor(name, node, index, rest) {
			super(Variable.Parameter, name, node, null, index, null);

			/**
			 * Whether the parameter definition is a part of a rest parameter.
			 * @member {boolean} ParameterDefinition#rest
			 */
			this.rest = rest;
		}
	}

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import * as types from "eslint-scope" */
	/** @import ESTree from "estree" */
	/** @import ScopeManager from "./scope-manager.js" */
	/** @typedef {ESTree.Function | ESTree.Program | ESTree.StaticBlock} Block */
	/** @typedef {{pattern: unknown, node: unknown}} MaybeImplicitGlobal */

	const { Syntax: Syntax$2 } = estraverse;

	/**
	 * Test if scope is struct
	 * @param {Scope} scope scope
	 * @param {Block} block block
	 * @param {boolean} isMethodDefinition is method definition
	 * @returns {boolean} is strict scope
	 */
	function isStrictScope(scope, block, isMethodDefinition) {
		let body;

		// When upper scope is exists and strict, inner scope is also strict.
		if (scope.upper && scope.upper.isStrict) {
			return true;
		}

		if (isMethodDefinition) {
			return true;
		}

		if (scope.type === "class" || scope.type === "module") {
			return true;
		}

		if (scope.type === "block" || scope.type === "switch") {
			return false;
		}

		if (scope.type === "function") {
			if (
				block.type === Syntax$2.ArrowFunctionExpression &&
				// @ts-ignore -- when block is ArrowFunctionExpression
				block.body.type !== Syntax$2.BlockStatement
			) {
				return false;
			}

			if (block.type === Syntax$2.Program) {
				body = block;
			} else {
				body = block.body;
			}

			if (!body) {
				return false;
			}
		} else if (scope.type === "global") {
			body = block;
		} else {
			return false;
		}

		// Search for a 'use strict' directive.
		// @ts-ignore -- body is a function body
		for (let i = 0, iz = body.body.length; i < iz; ++i) {
			// @ts-ignore -- body is a function body
			const stmt = body.body[i];

			/*
			 * Check if the current statement is a directive.
			 * If it isn't, then we're past the directive prologue
			 * so stop the search because directives cannot
			 * appear after this point.
			 *
			 * Some parsers set `directive:null` on non-directive
			 * statements, so the `typeof` check is safer than
			 * checking for property existence.
			 */
			if (typeof stmt.directive !== "string") {
				break;
			}

			if (stmt.directive === "use strict") {
				return true;
			}
		}

		return false;
	}

	/**
	 * Register scope
	 * @param {ScopeManager} scopeManager scope manager
	 * @param {Scope} scope scope
	 * @returns {void}
	 */
	function registerScope(scopeManager, scope) {
		scopeManager.scopes.push(scope);

		const scopes = scopeManager.__nodeToScope.get(scope.block);

		if (scopes) {
			scopes.push(scope);
		} else {
			scopeManager.__nodeToScope.set(scope.block, [scope]);
		}
	}

	/**
	 * @constructor Scope
	 * @implements {types.Scope}
	 */
	class Scope {
		constructor(scopeManager, type, upperScope, block, isMethodDefinition) {
			/**
			 * One of "global", "module", "function", "function-expression-name", "block", "switch", "catch", "with", "for",
			 * "class", "class-field-initializer", "class-static-block".
			 * @member {string} Scope#type
			 */
			this.type = type;

			/**
			 * The scoped {@link Variable}s of this scope, as <code>{ Variable.name
			 * : Variable }</code>.
			 * @member {Map} Scope#set
			 */
			this.set = new Map();

			/**
			 * The tainted variables of this scope, as <code>{ Variable.name :
			 * boolean }</code>.
			 *  @member {Map} Scope#taints
			 */
			this.taints = new Map();

			/**
			 * Generally, through the lexical scoping of JS you can always know
			 * which variable an identifier in the source code refers to. There are
			 * a few exceptions to this rule. With 'global' and 'with' scopes you
			 * can only decide at runtime which variable a reference refers to.
			 * Moreover, if 'eval()' is used in a scope, it might introduce new
			 * bindings in this or its parent scopes.
			 * All those scopes are considered 'dynamic'.
			 * @member {boolean} Scope#dynamic
			 */
			this.dynamic = this.type === "global" || this.type === "with";

			/**
			 * A reference to the scope-defining syntax node.
			 * @member {espree.Node} Scope#block
			 */
			this.block = block;

			/**
			 * The {@link Reference|references} that are not resolved with this scope.
			 * @member {Reference[]} Scope#through
			 */
			this.through = [];

			/**
			 * The scoped {@link Variable}s of this scope. In the case of a
			 * 'function' scope this includes the automatic argument <em>arguments</em> as
			 * its first element, as well as all further formal arguments.
			 * @member {Variable[]} Scope#variables
			 */
			this.variables = [];

			/**
			 * Any variable {@link Reference|reference} found in this scope. This
			 * includes occurrences of local variables as well as variables from
			 * parent scopes (including the global scope). For local variables
			 * this also includes defining occurrences (like in a 'var' statement).
			 * In a 'function' scope this does not include the occurrences of the
			 * formal parameter in the parameter list.
			 * @member {Reference[]} Scope#references
			 */
			this.references = [];

			/**
			 * For 'global' and 'function' scopes, this is a self-reference. For
			 * other scope types this is the <em>variableScope</em> value of the
			 * parent scope.
			 * @member {Scope} Scope#variableScope
			 */
			this.variableScope =
				this.type === "global" ||
				this.type === "module" ||
				this.type === "function" ||
				this.type === "class-field-initializer" ||
				this.type === "class-static-block"
					? this
					: upperScope.variableScope;

			/**
			 * Whether this scope is created by a FunctionExpression.
			 * @member {boolean} Scope#functionExpressionScope
			 */
			this.functionExpressionScope = /** @type {any} */ (false);

			/**
			 * Whether this is a scope that contains an 'eval()' invocation.
			 * @member {boolean} Scope#directCallToEvalScope
			 */
			this.directCallToEvalScope = false;

			/**
			 * @member {boolean} Scope#thisFound
			 */
			this.thisFound = false;

			/** @type {?Reference[]} */
			this.__left = [];

			/**
			 * Reference to the parent {@link Scope|scope}.
			 * @member {Scope} Scope#upper
			 */
			this.upper = upperScope;

			/**
			 * Whether 'use strict' is in effect in this scope.
			 * @member {boolean} Scope#isStrict
			 */
			this.isStrict = scopeManager.isStrictModeSupported()
				? isStrictScope(this, block, isMethodDefinition)
				: false;

			/**
			 * List of nested {@link Scope}s.
			 * @member {Scope[]} Scope#childScopes
			 */
			this.childScopes = [];
			if (this.upper) {
				this.upper.childScopes.push(this);
			}

			this.__declaredVariables = scopeManager.__declaredVariables;

			registerScope(scopeManager, this);
		}

		__shouldStaticallyClose(scopeManager) {
			return (
				!this.dynamic ||
				scopeManager.__isOptimistic() ||
				this.type === "global"
			);
		}

		__staticCloseRef(ref) {
			if (!this.__resolve(ref)) {
				this.__delegateToUpperScope(ref);
			}
		}

		__dynamicCloseRef(ref) {
			// notify all names are through to global
			let current = this;

			do {
				current.through.push(ref);
				current = current.upper;
			} while (current);
		}

		__close(scopeManager) {
			let closeRef;

			if (this.__shouldStaticallyClose(scopeManager)) {
				closeRef = this.__staticCloseRef;
			} else {
				closeRef = this.__dynamicCloseRef;
			}

			// Try Resolving all references in this scope.
			// @ts-ignore -- __left should be an array here
			for (let i = 0, iz = this.__left.length; i < iz; ++i) {
				// @ts-ignore -- __left should be an array here
				const ref = this.__left[i];

				closeRef.call(this, ref);
			}
			this.__left = null;

			return this.upper;
		}

		// To override by function scopes.
		// References in default parameters isn't resolved to variables which are in their function body.
		// eslint-disable-next-line class-methods-use-this, no-unused-vars  -- Desired as instance method with signature
		__isValidResolution(ref, variable) {
			return true;
		}

		__resolve(ref) {
			const name = ref.identifier.name;

			if (!this.set.has(name)) {
				return false;
			}
			const variable = this.set.get(name);

			if (!this.__isValidResolution(ref, variable)) {
				return false;
			}
			variable.references.push(ref);
			variable.stack =
				variable.stack && ref.from.variableScope === this.variableScope;
			if (ref.tainted) {
				variable.tainted = true;
				this.taints.set(variable.name, true);
			}
			ref.resolved = variable;

			return true;
		}

		__delegateToUpperScope(ref) {
			if (this.upper) {
				this.upper.__left.push(ref);
			}
			this.through.push(ref);
		}

		__addDeclaredVariablesOfNode(variable, node) {
			if (node === null || node === void 0) {
				return;
			}

			let variables = this.__declaredVariables.get(node);

			if (variables === null || variables === void 0) {
				variables = [];
				this.__declaredVariables.set(node, variables);
			}
			if (!variables.includes(variable)) {
				variables.push(variable);
			}
		}

		__defineGeneric(name, set, variables, node, def) {
			let variable;

			variable = set.get(name);
			if (!variable) {
				variable = new Variable(name, this);
				set.set(name, variable);
				variables.push(variable);
			}

			if (def) {
				variable.defs.push(def);
				this.__addDeclaredVariablesOfNode(variable, def.node);
				this.__addDeclaredVariablesOfNode(variable, def.parent);
			}
			if (node) {
				variable.identifiers.push(node);
			}
		}

		__define(node, def) {
			if (node && node.type === Syntax$2.Identifier) {
				this.__defineGeneric(
					node.name,
					this.set,
					this.variables,
					node,
					def,
				);
			}
		}

		__referencing(node, assign, writeExpr, maybeImplicitGlobal, partial, init) {
			// because Array element may be null
			if (
				!node ||
				(node.type !== Syntax$2.Identifier && node.type !== "JSXIdentifier")
			) {
				return;
			}

			// Specially handle like `this`.
			if (node.name === "super") {
				return;
			}

			const ref = new Reference(
				node,
				this,
				assign || Reference.READ,
				writeExpr,
				maybeImplicitGlobal,
				!!partial,
				!!init,
			);

			this.references.push(ref);

			// @ts-ignore -- __left should be an array here
			this.__left.push(ref);
		}

		__detectEval() {
			let current = this;

			this.directCallToEvalScope = true;
			do {
				current.dynamic = true;
				current = current.upper;
			} while (current);
		}

		__detectThis() {
			this.thisFound = true;
		}

		__isClosed() {
			return this.__left === null;
		}

		/**
		 * returns resolved {Reference}
		 * @function Scope#resolve
		 * @param {ESTree.Identifier} ident identifier to be resolved.
		 * @returns {?Reference} reference
		 */
		resolve(ident) {
			let ref, i, iz;

			assert(this.__isClosed(), "Scope should be closed.");
			assert(
				ident.type === Syntax$2.Identifier,
				"Target should be identifier.",
			);
			for (i = 0, iz = this.references.length; i < iz; ++i) {
				ref = this.references[i];
				if (ref.identifier === ident) {
					return ref;
				}
			}
			return null;
		}

		/**
		 * returns this scope is static
		 * @function Scope#isStatic
		 * @returns {boolean} static
		 */
		isStatic() {
			return !this.dynamic;
		}

		/**
		 * returns this scope has materialized arguments
		 * @function Scope#isArgumentsMaterialized
		 * @returns {any} arguments materialized
		 */ // eslint-disable-next-line class-methods-use-this -- Desired as instance method
		isArgumentsMaterialized() {
			return true;
		}

		/**
		 * returns this scope has materialized `this` reference
		 * @function Scope#isThisMaterialized
		 * @returns {any} this materialized
		 */ // eslint-disable-next-line class-methods-use-this -- Desired as instance method
		isThisMaterialized() {
			return true;
		}

		isUsedName(name) {
			if (this.set.has(name)) {
				return true;
			}
			for (let i = 0, iz = this.through.length; i < iz; ++i) {
				if (this.through[i].identifier.name === name) {
					return true;
				}
			}
			return false;
		}
	}

	/**
	 * Global scope.
	 * @implements {types.GlobalScope}
	 */
	class GlobalScope extends Scope {
		constructor(scopeManager, block) {
			super(scopeManager, "global", null, block, false);
			this.implicit = {
				set: new Map(),

				/** @type {Variable[]} */
				variables: [],

				/**
				 * List of {@link Reference}s that are left to be resolved (i.e. which
				 * need to be linked to the variable they refer to).
				 * @member {Reference[]} Scope#implicit#left
				 * @type {Reference[]}
				 */
				left: [],
			};
		}

		__close(scopeManager) {
			const implicit = [];

			// @ts-ignore -- __left should be an array here
			for (let i = 0, iz = this.__left.length; i < iz; ++i) {
				// @ts-ignore -- __left should be an array here
				const ref = this.__left[i];

				if (
					ref.__maybeImplicitGlobal &&
					!this.set.has(ref.identifier.name)
				) {
					implicit.push(ref.__maybeImplicitGlobal);
				}
			}

			// create an implicit global variable from assignment expression
			for (let i = 0, iz = implicit.length; i < iz; ++i) {
				const info = implicit[i];

				this.__defineImplicit(
					info.pattern,
					new Definition(
						Variable.ImplicitGlobalVariable,
						info.pattern,
						info.node,
						null,
						null,
						null,
					),
				);
			}

			super.__close(scopeManager);

			this.implicit.left = [...this.through];

			return null;
		}

		__defineImplicit(node, def) {
			if (node && node.type === Syntax$2.Identifier) {
				this.__defineGeneric(
					node.name,
					this.implicit.set,
					this.implicit.variables,
					node,
					def,
				);
			}
		}

		__addVariables(names) {
			for (const name of names) {
				this.__defineGeneric(name, this.set, this.variables, null, null);
			}

			const namesSet = new Set(names);

			this.through = this.through.filter(reference => {
				const name = reference.identifier.name;

				if (namesSet.has(name)) {
					const variable = this.set.get(name);

					reference.resolved = variable;
					variable.references.push(reference);

					return false;
				}

				return true;
			});

			this.implicit.variables = this.implicit.variables.filter(variable => {
				const name = variable.name;

				if (namesSet.has(name)) {
					this.implicit.set.delete(name);

					return false;
				}

				return true;
			});

			this.implicit.left = this.implicit.left.filter(
				reference => !namesSet.has(reference.identifier.name),
			);
		}
	}

	/**
	 * Module scope.
	 * @implements {types.ModuleScope}
	 */
	class ModuleScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "module", upperScope, block, false);
		}
	}

	/**
	 * Function expression name scope.
	 * @implements {types.FunctionExpressionNameScope}
	 */
	class FunctionExpressionNameScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(
				scopeManager,
				"function-expression-name",
				upperScope,
				block,
				false,
			);
			this.__define(
				block.id,
				new Definition(
					Variable.FunctionName,
					block.id,
					block,
					null,
					null,
					null,
				),
			);
			this.functionExpressionScope = /** @type {const} */ (true);
		}
	}

	/**
	 * Catch scope.
	 * @implements {types.CatchScope}
	 */
	class CatchScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "catch", upperScope, block, false);
		}
	}

	/**
	 * With statement scope.
	 * @implements {types.WithScope}
	 */
	class WithScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "with", upperScope, block, false);
		}

		__close(scopeManager) {
			if (this.__shouldStaticallyClose(scopeManager)) {
				return super.__close(scopeManager);
			}

			// @ts-ignore -- __left should be an array here
			for (let i = 0, iz = this.__left.length; i < iz; ++i) {
				// @ts-ignore -- __left should be an array here
				const ref = this.__left[i];

				ref.tainted = true;
				this.__delegateToUpperScope(ref);
			}
			this.__left = null;

			return this.upper;
		}
	}

	/**
	 * Block scope.
	 * @implements {types.BlockScope}
	 */
	class BlockScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "block", upperScope, block, false);
		}
	}

	/**
	 * Switch scope.
	 * @implements {types.SwitchScope}
	 */
	class SwitchScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "switch", upperScope, block, false);
		}
	}

	/**
	 * Function scope.
	 * @implements {types.FunctionScope}
	 */
	class FunctionScope extends Scope {
		constructor(scopeManager, upperScope, block, isMethodDefinition) {
			super(scopeManager, "function", upperScope, block, isMethodDefinition);

			// section 9.2.13, FunctionDeclarationInstantiation.
			// NOTE Arrow functions never have an arguments objects.
			if (this.block.type !== Syntax$2.ArrowFunctionExpression) {
				this.__defineArguments();
			}
		}

		isArgumentsMaterialized() {
			// TODO(Constellation)
			// We can more aggressive on this condition like this.
			//
			// function t() {
			//     // arguments of t is always hidden.
			//     function arguments() {
			//     }
			// }
			if (this.block.type === Syntax$2.ArrowFunctionExpression) {
				return false;
			}

			if (!this.isStatic()) {
				return true;
			}

			const variable = this.set.get("arguments");

			assert(variable, "Always have arguments variable.");
			return variable.tainted || variable.references.length !== 0;
		}

		isThisMaterialized() {
			if (!this.isStatic()) {
				return true;
			}
			return this.thisFound;
		}

		__defineArguments() {
			this.__defineGeneric("arguments", this.set, this.variables, null, null);
			this.taints.set("arguments", true);
		}

		// References in default parameters isn't resolved to variables which are in their function body.
		//     const x = 1
		//     function f(a = x) { // This `x` is resolved to the `x` in the outer scope.
		//         const x = 2
		//         console.log(a)
		//     }
		__isValidResolution(ref, variable) {
			// If `options.nodejsScope` is true, `this.block` becomes a Program node.
			if (this.block.type === "Program") {
				return true;
			}

			const bodyStart = this.block.body.range[0];

			// It's invalid resolution in the following case:
			return !(
				variable.scope === this &&
				ref.identifier.range[0] < bodyStart && // the reference is in the parameter part.
				variable.defs.every(d => d.name.range[0] >= bodyStart) // the variable is in the body.
			);
		}
	}

	/**
	 * Scope of for, for-in, and for-of statements.
	 * @implements {types.ForScope}
	 */
	class ForScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "for", upperScope, block, false);
		}
	}

	/**
	 * Class scope.
	 * @implements {types.ClassScope}
	 */
	class ClassScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "class", upperScope, block, false);
		}
	}

	/**
	 * Class field initializer scope.
	 * @implements {types.ClassFieldInitializerScope}
	 */
	class ClassFieldInitializerScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "class-field-initializer", upperScope, block, true);
		}
	}

	/**
	 * Class static block scope.
	 * @implements {types.ClassStaticBlockScope}
	 */
	class ClassStaticBlockScope extends Scope {
		constructor(scopeManager, upperScope, block) {
			super(scopeManager, "class-static-block", upperScope, block, true);
		}
	}

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import * as types from "eslint-scope" */
	/** @import ESTree from "estree" */
	/** @import { Scope } from "./scope.js" */
	/** @import Variable from "./variable.js" */

	/**
	 * @constructor ScopeManager
	 * @implements {types.ScopeManager}
	 */
	class ScopeManager {
		constructor(options) {
			this.scopes = [];
			this.globalScope = null;
			this.__nodeToScope = new WeakMap();
			this.__currentScope = null;
			this.__options = options;
			this.__declaredVariables = new WeakMap();
		}

		__isOptimistic() {
			return this.__options.optimistic;
		}

		__ignoreEval() {
			return this.__options.ignoreEval;
		}

		__isJSXEnabled() {
			return this.__options.jsx === true;
		}

		isGlobalReturn() {
			return (
				this.__options.nodejsScope ||
				this.__options.sourceType === "commonjs"
			);
		}

		isModule() {
			return this.__options.sourceType === "module";
		}

		isImpliedStrict() {
			return !!this.__options.impliedStrict;
		}

		isStrictModeSupported() {
			return this.__options.ecmaVersion >= 5;
		}

		// Returns appropriate scope for this node.
		__get(node) {
			return this.__nodeToScope.get(node);
		}

		/**
		 * Get variables that are declared by the node.
		 *
		 * "are declared by the node" means the node is same as `Variable.defs[].node` or `Variable.defs[].parent`.
		 * If the node declares nothing, this method returns an empty array.
		 * CAUTION: This API is experimental. See https://github.com/estools/escope/pull/69 for more details.
		 * @param {ESTree.Node} node a node to get.
		 * @returns {Variable[]} variables that declared by the node.
		 */
		getDeclaredVariables(node) {
			return this.__declaredVariables.get(node) || [];
		}

		/**
		 * acquire scope from node.
		 * @function ScopeManager#acquire
		 * @param {ESTree.Node} node node for the acquired scope.
		 * @param {?boolean} [inner=false] look up the most inner scope, default value is false.
		 * @returns {Scope?} Scope from node
		 */
		acquire(node, inner) {
			/**
			 * predicate
			 * @param {Scope} testScope scope to test
			 * @returns {boolean} predicate
			 */
			function predicate(testScope) {
				if (
					testScope.type === "function" &&
					testScope.functionExpressionScope
				) {
					return false;
				}
				return true;
			}

			const scopes = this.__get(node);

			if (!scopes || scopes.length === 0) {
				return null;
			}

			// Heuristic selection from all scopes.
			// If you would like to get all scopes, please use ScopeManager#acquireAll.
			if (scopes.length === 1) {
				return scopes[0];
			}

			if (inner) {
				for (let i = scopes.length - 1; i >= 0; --i) {
					const scope = scopes[i];

					if (predicate(scope)) {
						return scope;
					}
				}
			} else {
				for (let i = 0, iz = scopes.length; i < iz; ++i) {
					const scope = scopes[i];

					if (predicate(scope)) {
						return scope;
					}
				}
			}

			return null;
		}

		/**
		 * acquire all scopes from node.
		 * @function ScopeManager#acquireAll
		 * @param {ESTree.Node} node node for the acquired scope.
		 * @returns {Scope[]?} Scope array
		 */
		acquireAll(node) {
			return this.__get(node);
		}

		/**
		 * release the node.
		 * @function ScopeManager#release
		 * @param {ESTree.Node} node releasing node.
		 * @param {?boolean} [inner=false] look up the most inner scope, default value is false.
		 * @returns {Scope?} upper scope for the node.
		 */
		release(node, inner) {
			const scopes = this.__get(node);

			if (scopes && scopes.length) {
				const scope = scopes[0].upper;

				if (!scope) {
					return null;
				}
				return this.acquire(scope.block, inner);
			}
			return null;
		}

		/**
		 * Add global variables and resolve their references.
		 * @function ScopeManager#addGlobals
		 * @param {string[]} names Names of global variables to add.
		 * @returns {void}
		 */
		addGlobals(names) {
			// @ts-ignore -- globalScope must be set before this method is called.
			this.globalScope.__addVariables(names);
		}

		attach() {} // eslint-disable-line class-methods-use-this -- Desired as instance method

		detach() {} // eslint-disable-line class-methods-use-this -- Desired as instance method

		__nestScope(scope) {
			if (scope instanceof GlobalScope) {
				assert(this.__currentScope === null);
				this.globalScope = scope;
			}
			this.__currentScope = scope;
			return scope;
		}

		__nestGlobalScope(node) {
			return this.__nestScope(new GlobalScope(this, node));
		}

		__nestBlockScope(node) {
			return this.__nestScope(
				new BlockScope(this, this.__currentScope, node),
			);
		}

		__nestFunctionScope(node, isMethodDefinition) {
			return this.__nestScope(
				new FunctionScope(
					this,
					this.__currentScope,
					node,
					isMethodDefinition,
				),
			);
		}

		__nestForScope(node) {
			return this.__nestScope(new ForScope(this, this.__currentScope, node));
		}

		__nestCatchScope(node) {
			return this.__nestScope(
				new CatchScope(this, this.__currentScope, node),
			);
		}

		__nestWithScope(node) {
			return this.__nestScope(new WithScope(this, this.__currentScope, node));
		}

		__nestClassScope(node) {
			return this.__nestScope(
				new ClassScope(this, this.__currentScope, node),
			);
		}

		__nestClassFieldInitializerScope(node) {
			return this.__nestScope(
				new ClassFieldInitializerScope(this, this.__currentScope, node),
			);
		}

		__nestClassStaticBlockScope(node) {
			return this.__nestScope(
				new ClassStaticBlockScope(this, this.__currentScope, node),
			);
		}

		__nestSwitchScope(node) {
			return this.__nestScope(
				new SwitchScope(this, this.__currentScope, node),
			);
		}

		__nestModuleScope(node) {
			return this.__nestScope(
				new ModuleScope(this, this.__currentScope, node),
			);
		}

		__nestFunctionExpressionNameScope(node) {
			return this.__nestScope(
				new FunctionExpressionNameScope(this, this.__currentScope, node),
			);
		}

		__isES6() {
			return this.__options.ecmaVersion >= 6;
		}
	}

	/* vim: set sw=4 ts=4 et tw=80 : */

	var esrecurse$1 = {};

	var version$1 = "4.3.0";
	var require$$1 = {
		version: version$1};

	/*
	  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	var hasRequiredEsrecurse;

	function requireEsrecurse () {
		if (hasRequiredEsrecurse) return esrecurse$1;
		hasRequiredEsrecurse = 1;
		(function () {

		    var estraverse = requireEstraverse();

		    function isNode(node) {
		        if (node == null) {
		            return false;
		        }
		        return typeof node === 'object' && typeof node.type === 'string';
		    }

		    function isProperty(nodeType, key) {
		        return (nodeType === estraverse.Syntax.ObjectExpression || nodeType === estraverse.Syntax.ObjectPattern) && key === 'properties';
		    }

		    function Visitor(visitor, options) {
		        options = options || {};

		        this.__visitor = visitor ||  this;
		        this.__childVisitorKeys = options.childVisitorKeys
		            ? Object.assign({}, estraverse.VisitorKeys, options.childVisitorKeys)
		            : estraverse.VisitorKeys;
		        if (options.fallback === 'iteration') {
		            this.__fallback = Object.keys;
		        } else if (typeof options.fallback === 'function') {
		            this.__fallback = options.fallback;
		        }
		    }

		    /* Default method for visiting children.
		     * When you need to call default visiting operation inside custom visiting
		     * operation, you can use it with `this.visitChildren(node)`.
		     */
		    Visitor.prototype.visitChildren = function (node) {
		        var type, children, i, iz, j, jz, child;

		        if (node == null) {
		            return;
		        }

		        type = node.type || estraverse.Syntax.Property;

		        children = this.__childVisitorKeys[type];
		        if (!children) {
		            if (this.__fallback) {
		                children = this.__fallback(node);
		            } else {
		                throw new Error('Unknown node type ' + type + '.');
		            }
		        }

		        for (i = 0, iz = children.length; i < iz; ++i) {
		            child = node[children[i]];
		            if (child) {
		                if (Array.isArray(child)) {
		                    for (j = 0, jz = child.length; j < jz; ++j) {
		                        if (child[j]) {
		                            if (isNode(child[j]) || isProperty(type, children[i])) {
		                                this.visit(child[j]);
		                            }
		                        }
		                    }
		                } else if (isNode(child)) {
		                    this.visit(child);
		                }
		            }
		        }
		    };

		    /* Dispatching node. */
		    Visitor.prototype.visit = function (node) {
		        var type;

		        if (node == null) {
		            return;
		        }

		        type = node.type || estraverse.Syntax.Property;
		        if (this.__visitor[type]) {
		            this.__visitor[type].call(this, node);
		            return;
		        }
		        this.visitChildren(node);
		    };

		    esrecurse$1.version = require$$1.version;
		    esrecurse$1.Visitor = Visitor;
		    esrecurse$1.visit = function (node, visitor, options) {
		        var v = new Visitor(visitor, options);
		        v.visit(node);
		    };
		}());
		/* vim: set sw=4 ts=4 et tw=80 : */
		return esrecurse$1;
	}

	var esrecurseExports = requireEsrecurse();
	var esrecurse = /*@__PURE__*/getDefaultExportFromCjs(esrecurseExports);

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import * as types from "eslint-scope" */

	const { Syntax: Syntax$1 } = estraverse;

	/**
	 * Get last array element
	 * @param {Array} xs array
	 * @returns {any} Last elment
	 */
	function getLast(xs) {
		return xs.at(-1) || null;
	}

	/**
	 * Visitor for destructuring patterns.
	 * @implements {types.PatternVisitor}
	 */
	class PatternVisitor extends esrecurse.Visitor {
		static isPattern(node) {
			const nodeType = node.type;

			return (
				nodeType === Syntax$1.Identifier ||
				nodeType === Syntax$1.ObjectPattern ||
				nodeType === Syntax$1.ArrayPattern ||
				nodeType === Syntax$1.SpreadElement ||
				nodeType === Syntax$1.RestElement ||
				nodeType === Syntax$1.AssignmentPattern
			);
		}

		constructor(options, rootPattern, callback) {
			super(null, options);
			this.rootPattern = rootPattern;
			this.callback = callback;
			this.assignments = [];
			this.rightHandNodes = [];
			this.restElements = [];
		}

		Identifier(pattern) {
			const lastRestElement = getLast(this.restElements);

			this.callback(pattern, {
				topLevel: pattern === this.rootPattern,
				rest:
					lastRestElement !== null &&
					lastRestElement !== void 0 &&
					lastRestElement.argument === pattern,
				assignments: this.assignments,
			});
		}

		Property(property) {
			// Computed property's key is a right hand node.
			if (property.computed) {
				this.rightHandNodes.push(property.key);
			}

			// If it's shorthand, its key is same as its value.
			// If it's shorthand and has its default value, its key is same as its value.left (the value is AssignmentPattern).
			// If it's not shorthand, the name of new variable is its value's.
			this.visit(property.value);
		}

		ArrayPattern(pattern) {
			for (let i = 0, iz = pattern.elements.length; i < iz; ++i) {
				const element = pattern.elements[i];

				this.visit(element);
			}
		}

		AssignmentPattern(pattern) {
			this.assignments.push(pattern);
			this.visit(pattern.left);
			this.rightHandNodes.push(pattern.right);
			this.assignments.pop();
		}

		RestElement(pattern) {
			this.restElements.push(pattern);
			this.visit(pattern.argument);
			this.restElements.pop();
		}

		MemberExpression(node) {
			// Computed property's key is a right hand node.
			if (node.computed) {
				this.rightHandNodes.push(node.property);
			}

			// the object is only read, write to its property.
			this.rightHandNodes.push(node.object);
		}

		//
		// ForInStatement.left and AssignmentExpression.left are LeftHandSideExpression.
		// By spec, LeftHandSideExpression is Pattern or MemberExpression.
		//   (see also: https://github.com/estree/estree/pull/20#issuecomment-74584758)
		// But espree 2.0 parses to ArrayExpression, ObjectExpression, etc...
		//

		SpreadElement(node) {
			this.visit(node.argument);
		}

		ArrayExpression(node) {
			node.elements.forEach(this.visit, this);
		}

		AssignmentExpression(node) {
			this.assignments.push(node);
			this.visit(node.left);
			this.rightHandNodes.push(node.right);
			this.assignments.pop();
		}

		CallExpression(node) {
			// arguments are right hand nodes.
			node.arguments.forEach(a => {
				this.rightHandNodes.push(a);
			});
			this.visit(node.callee);
		}
	}

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import * as types from "eslint-scope" */
	/** @import ESTree from "estree" */

	const { Syntax } = estraverse;

	/**
	 * Traverse identifier in pattern
	 * @param {Object} options options
	 * @param {ESTree.Pattern} rootPattern root pattern
	 * @param {?Referencer} referencer referencer
	 * @param {types.PatternVisitorCallback} callback callback
	 * @returns {void}
	 */
	function traverseIdentifierInPattern(
		options,
		rootPattern,
		referencer,
		callback,
	) {
		// Call the callback at left hand identifier nodes, and Collect right hand nodes.
		const visitor = new PatternVisitor(options, rootPattern, callback);

		visitor.visit(rootPattern);

		// Process the right hand nodes recursively.
		if (referencer !== null && referencer !== void 0) {
			visitor.rightHandNodes.forEach(referencer.visit, referencer);
		}
	}

	// Importing ImportDeclaration.
	// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-moduledeclarationinstantiation
	// https://github.com/estree/estree/blob/master/es6.md#importdeclaration
	// FIXME: Now, we don't create module environment, because the context is
	// implementation dependent.

	/**
	 * Visitor for import specifiers.
	 */
	class Importer extends esrecurse.Visitor {
		constructor(declaration, referencer) {
			super(null, referencer.options);
			this.declaration = declaration;
			this.referencer = referencer;
		}

		visitImport(id, specifier) {
			this.referencer.visitPattern(id, pattern => {
				this.referencer
					.currentScope()
					.__define(
						pattern,
						new Definition(
							Variable.ImportBinding,
							pattern,
							specifier,
							this.declaration,
							null,
							null,
						),
					);
			});
		}

		ImportNamespaceSpecifier(node) {
			const local = node.local || node.id;

			if (local) {
				this.visitImport(local, node);
			}
		}

		ImportDefaultSpecifier(node) {
			const local = node.local || node.id;

			this.visitImport(local, node);
		}

		ImportSpecifier(node) {
			const local = node.local || node.id;

			if (node.name) {
				this.visitImport(node.name, node);
			} else {
				this.visitImport(local, node);
			}
		}
	}

	/**
	 * Referencing variables and creating bindings.
	 * @implements {types.Referencer}
	 */
	class Referencer extends esrecurse.Visitor {
		constructor(options, scopeManager) {
			super(null, options);
			this.options = options;
			this.scopeManager = scopeManager;
			this.parent = null;
			this.isInnerMethodDefinition = false;
		}

		currentScope() {
			return this.scopeManager.__currentScope;
		}

		close(node) {
			while (this.currentScope() && node === this.currentScope().block) {
				this.scopeManager.__currentScope = this.currentScope().__close(
					this.scopeManager,
				);
			}
		}

		pushInnerMethodDefinition(isInnerMethodDefinition) {
			const previous = this.isInnerMethodDefinition;

			this.isInnerMethodDefinition = isInnerMethodDefinition;
			return previous;
		}

		popInnerMethodDefinition(isInnerMethodDefinition) {
			this.isInnerMethodDefinition = isInnerMethodDefinition;
		}

		referencingDefaultValue(pattern, assignments, maybeImplicitGlobal, init) {
			const scope = this.currentScope();

			assignments.forEach(assignment => {
				scope.__referencing(
					pattern,
					Reference.WRITE,
					assignment.right,
					maybeImplicitGlobal,
					pattern !== assignment.left,
					init,
				);
			});
		}

		visitPattern(node, options, callback) {
			let visitPatternOptions = options;
			let visitPatternCallback = callback;

			if (typeof options === "function") {
				visitPatternCallback = options;
				visitPatternOptions = { processRightHandNodes: false };
			}

			traverseIdentifierInPattern(
				this.options,
				node,
				visitPatternOptions.processRightHandNodes ? this : null,
				visitPatternCallback,
			);
		}

		visitFunction(node) {
			let i, iz;

			// FunctionDeclaration name is defined in upper scope
			// NOTE: Not referring variableScope. It is intended.
			// Since
			//  in ES5, FunctionDeclaration should be in FunctionBody.
			//  in ES6, FunctionDeclaration should be block scoped.

			if (node.type === Syntax.FunctionDeclaration) {
				// id is defined in upper scope
				this.currentScope().__define(
					node.id,
					new Definition(
						Variable.FunctionName,
						node.id,
						node,
						null,
						null,
						null,
					),
				);
			}

			// FunctionExpression with name creates its special scope;
			// FunctionExpressionNameScope.
			if (node.type === Syntax.FunctionExpression && node.id) {
				this.scopeManager.__nestFunctionExpressionNameScope(node);
			}

			// Consider this function is in the MethodDefinition.
			this.scopeManager.__nestFunctionScope(
				node,
				this.isInnerMethodDefinition,
			);

			const that = this;

			/**
			 * Visit pattern callback
			 * @param {ESTree.Pattern} pattern pattern
			 * @param {Object} info info
			 * @returns {void}
			 */
			function visitPatternCallback(pattern, info) {
				that.currentScope().__define(
					pattern,
					new ParameterDefinition(pattern, node, i, info.rest),
				);

				that.referencingDefaultValue(pattern, info.assignments, null, true);
			}

			// Process parameter declarations.
			for (i = 0, iz = node.params.length; i < iz; ++i) {
				this.visitPattern(
					node.params[i],
					{ processRightHandNodes: true },
					visitPatternCallback,
				);
			}

			// if there's a rest argument, add that
			if (node.rest) {
				this.visitPattern(
					{
						type: "RestElement",
						argument: node.rest,
					},
					pattern => {
						this.currentScope().__define(
							pattern,
							new ParameterDefinition(
								pattern,
								node,
								node.params.length,
								true,
							),
						);
					},
				);
			}

			// In TypeScript there are a number of function-like constructs which have no body,
			// so check it exists before traversing
			if (node.body) {
				// Skip BlockStatement to prevent creating BlockStatement scope.
				if (node.body.type === Syntax.BlockStatement) {
					this.visitChildren(node.body);
				} else {
					this.visit(node.body);
				}
			}

			this.close(node);
		}

		visitClass(node) {
			if (node.type === Syntax.ClassDeclaration) {
				this.currentScope().__define(
					node.id,
					new Definition(
						Variable.ClassName,
						node.id,
						node,
						null,
						null,
						null,
					),
				);
			}

			this.scopeManager.__nestClassScope(node);

			if (node.id) {
				this.currentScope().__define(
					node.id,
					new Definition(Variable.ClassName, node.id, node),
				);
			}

			this.visit(node.superClass);
			this.visit(node.body);

			this.close(node);
		}

		visitProperty(node) {
			let previous;

			if (node.computed) {
				this.visit(node.key);
			}

			const isMethodDefinition = node.type === Syntax.MethodDefinition;

			if (isMethodDefinition) {
				previous = this.pushInnerMethodDefinition(true);
			}
			this.visit(node.value);
			if (isMethodDefinition) {
				this.popInnerMethodDefinition(previous);
			}
		}

		visitForIn(node) {
			if (
				node.left.type === Syntax.VariableDeclaration &&
				node.left.kind !== "var"
			) {
				this.scopeManager.__nestForScope(node);
			}

			if (node.left.type === Syntax.VariableDeclaration) {
				this.visit(node.left);
				this.visitPattern(node.left.declarations[0].id, pattern => {
					this.currentScope().__referencing(
						pattern,
						Reference.WRITE,
						node.right,
						null,
						true,
						true,
					);
				});
			} else {
				this.visitPattern(
					node.left,
					{ processRightHandNodes: true },
					(pattern, info) => {
						let maybeImplicitGlobal = null;

						if (!this.currentScope().isStrict) {
							maybeImplicitGlobal = {
								pattern,
								node,
							};
						}
						this.referencingDefaultValue(
							pattern,
							info.assignments,
							maybeImplicitGlobal,
							false,
						);
						this.currentScope().__referencing(
							pattern,
							Reference.WRITE,
							node.right,
							maybeImplicitGlobal,
							true,
							false,
						);
					},
				);
			}
			this.visit(node.right);
			this.visit(node.body);

			this.close(node);
		}

		visitVariableDeclaration(variableTargetScope, type, node, index) {
			const decl = node.declarations[index];
			const init = decl.init;

			this.visitPattern(
				decl.id,
				{ processRightHandNodes: true },
				(pattern, info) => {
					variableTargetScope.__define(
						pattern,
						new Definition(type, pattern, decl, node, index, node.kind),
					);

					this.referencingDefaultValue(
						pattern,
						info.assignments,
						null,
						true,
					);
					if (init) {
						this.currentScope().__referencing(
							pattern,
							Reference.WRITE,
							init,
							null,
							!info.topLevel,
							true,
						);
					}
				},
			);
		}

		AssignmentExpression(node) {
			if (PatternVisitor.isPattern(node.left)) {
				if (node.operator === "=") {
					this.visitPattern(
						node.left,
						{ processRightHandNodes: true },
						(pattern, info) => {
							let maybeImplicitGlobal = null;

							if (!this.currentScope().isStrict) {
								maybeImplicitGlobal = {
									pattern,
									node,
								};
							}
							this.referencingDefaultValue(
								pattern,
								info.assignments,
								maybeImplicitGlobal,
								false,
							);
							this.currentScope().__referencing(
								pattern,
								Reference.WRITE,
								node.right,
								maybeImplicitGlobal,
								!info.topLevel,
								false,
							);
						},
					);
				} else {
					this.currentScope().__referencing(
						node.left,
						Reference.RW,
						node.right,
					);
				}
			} else {
				this.visit(node.left);
			}
			this.visit(node.right);
		}

		CatchClause(node) {
			this.scopeManager.__nestCatchScope(node);

			this.visitPattern(
				node.param,
				{ processRightHandNodes: true },
				(pattern, info) => {
					this.currentScope().__define(
						pattern,
						new Definition(
							Variable.CatchClause,
							pattern,
							node,
							null,
							null,
							null,
						),
					);
					this.referencingDefaultValue(
						pattern,
						info.assignments,
						null,
						true,
					);
				},
			);
			this.visit(node.body);

			this.close(node);
		}

		Program(node) {
			this.scopeManager.__nestGlobalScope(node);

			if (this.scopeManager.isGlobalReturn()) {
				// Force strictness of GlobalScope to false when using node.js scope.
				this.currentScope().isStrict = false;
				this.scopeManager.__nestFunctionScope(node, false);
			}

			if (this.scopeManager.__isES6() && this.scopeManager.isModule()) {
				this.scopeManager.__nestModuleScope(node);
			}

			if (
				this.scopeManager.isStrictModeSupported() &&
				this.scopeManager.isImpliedStrict()
			) {
				this.currentScope().isStrict = true;
			}

			this.visitChildren(node);
			this.close(node);
		}

		Identifier(node) {
			this.currentScope().__referencing(node);
		}

		// eslint-disable-next-line class-methods-use-this -- Desired as instance method
		PrivateIdentifier() {
			// Do nothing.
		}

		UpdateExpression(node) {
			if (PatternVisitor.isPattern(node.argument)) {
				this.currentScope().__referencing(
					node.argument,
					Reference.RW,
					null,
				);
			} else {
				this.visitChildren(node);
			}
		}

		MemberExpression(node) {
			this.visit(node.object);
			if (node.computed) {
				this.visit(node.property);
			}
		}

		Property(node) {
			this.visitProperty(node);
		}

		PropertyDefinition(node) {
			const { computed, key, value } = node;

			if (computed) {
				this.visit(key);
			}
			if (value) {
				this.scopeManager.__nestClassFieldInitializerScope(value);
				this.visit(value);
				this.close(value);
			}
		}

		StaticBlock(node) {
			this.scopeManager.__nestClassStaticBlockScope(node);

			this.visitChildren(node);

			this.close(node);
		}

		MethodDefinition(node) {
			this.visitProperty(node);
		}

		BreakStatement() {} // eslint-disable-line class-methods-use-this -- Desired as instance method

		ContinueStatement() {} // eslint-disable-line class-methods-use-this -- Desired as instance method

		LabeledStatement(node) {
			this.visit(node.body);
		}

		ForStatement(node) {
			// Create ForStatement declaration.
			// NOTE: In ES6, ForStatement dynamically generates
			// per iteration environment. However, escope is
			// a static analyzer, we only generate one scope for ForStatement.
			if (
				node.init &&
				node.init.type === Syntax.VariableDeclaration &&
				node.init.kind !== "var"
			) {
				this.scopeManager.__nestForScope(node);
			}

			this.visitChildren(node);

			this.close(node);
		}

		ClassExpression(node) {
			this.visitClass(node);
		}

		ClassDeclaration(node) {
			this.visitClass(node);
		}

		CallExpression(node) {
			// Check this is direct call to eval
			if (
				!this.scopeManager.__ignoreEval() &&
				node.callee.type === Syntax.Identifier &&
				node.callee.name === "eval"
			) {
				// NOTE: This should be `variableScope`. Since direct eval call always creates Lexical environment and
				// let / const should be enclosed into it. Only VariableDeclaration affects on the caller's environment.
				this.currentScope().variableScope.__detectEval();
			}
			this.visitChildren(node);
		}

		BlockStatement(node) {
			if (this.scopeManager.__isES6()) {
				this.scopeManager.__nestBlockScope(node);
			}

			this.visitChildren(node);

			this.close(node);
		}

		ThisExpression() {
			this.currentScope().variableScope.__detectThis();
		}

		WithStatement(node) {
			this.visit(node.object);

			// Then nest scope for WithStatement.
			this.scopeManager.__nestWithScope(node);

			this.visit(node.body);

			this.close(node);
		}

		VariableDeclaration(node) {
			const variableTargetScope =
				node.kind === "var"
					? this.currentScope().variableScope
					: this.currentScope();

			for (let i = 0, iz = node.declarations.length; i < iz; ++i) {
				const decl = node.declarations[i];

				this.visitVariableDeclaration(
					variableTargetScope,
					Variable.Variable,
					node,
					i,
				);
				if (decl.init) {
					this.visit(decl.init);
				}
			}
		}

		// sec 13.11.8
		SwitchStatement(node) {
			this.visit(node.discriminant);

			if (this.scopeManager.__isES6()) {
				this.scopeManager.__nestSwitchScope(node);
			}

			for (let i = 0, iz = node.cases.length; i < iz; ++i) {
				this.visit(node.cases[i]);
			}

			this.close(node);
		}

		FunctionDeclaration(node) {
			this.visitFunction(node);
		}

		FunctionExpression(node) {
			this.visitFunction(node);
		}

		ForOfStatement(node) {
			this.visitForIn(node);
		}

		ForInStatement(node) {
			this.visitForIn(node);
		}

		ArrowFunctionExpression(node) {
			this.visitFunction(node);
		}

		ImportDeclaration(node) {
			assert(
				this.scopeManager.__isES6() && this.scopeManager.isModule(),
				"ImportDeclaration should appear when the mode is ES6 and in the module context.",
			);

			const importer = new Importer(node, this);

			importer.visit(node);
		}

		visitExportDeclaration(node) {
			if (node.source) {
				return;
			}
			if (node.declaration) {
				this.visit(node.declaration);
				return;
			}

			this.visitChildren(node);
		}

		// TODO: ExportDeclaration doesn't exist. for bc?
		ExportDeclaration(node) {
			this.visitExportDeclaration(node);
		}

		ExportAllDeclaration(node) {
			this.visitExportDeclaration(node);
		}

		ExportDefaultDeclaration(node) {
			this.visitExportDeclaration(node);
		}

		ExportNamedDeclaration(node) {
			this.visitExportDeclaration(node);
		}

		ExportSpecifier(node) {
			// TODO: `node.id` doesn't exist. for bc?
			const local = node.id || node.local;

			this.visit(local);
		}

		// eslint-disable-next-line class-methods-use-this -- Desired as instance method
		MetaProperty() {
			// do nothing.
		}

		JSXIdentifier(node) {
			// Special case: "this" should not count as a reference
			if (this.scopeManager.__isJSXEnabled() && node.name !== "this") {
				this.currentScope().__referencing(node);
			}
		}

		JSXMemberExpression(node) {
			this.visit(node.object);
		}

		JSXElement(node) {
			if (this.scopeManager.__isJSXEnabled()) {
				this.visit(node.openingElement);
				node.children.forEach(this.visit, this);
			} else {
				this.visitChildren(node);
			}
		}

		JSXOpeningElement(node) {
			if (this.scopeManager.__isJSXEnabled()) {
				const nameNode = node.name;
				const isComponentName =
					nameNode.type === "JSXIdentifier" &&
					nameNode.name[0].toUpperCase() === nameNode.name[0];
				const isComponent =
					isComponentName || nameNode.type === "JSXMemberExpression";

				// we only want to visit JSXIdentifier nodes if they are capitalized
				if (isComponent) {
					this.visit(nameNode);
				}
			}

			node.attributes.forEach(this.visit, this);
		}

		JSXAttribute(node) {
			if (node.value) {
				this.visit(node.value);
			}
		}

		JSXExpressionContainer(node) {
			this.visit(node.expression);
		}

		JSXNamespacedName(node) {
			this.visit(node.namespace);
			this.visit(node.name);
		}
	}

	/* vim: set sw=4 ts=4 et tw=80 : */

	/*
	  Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2013 Alex Seville <hi@alexanderseville.com>
	  Copyright (C) 2014 Thiago de Arruda <tpadilha84@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	/** @import ESTree from "estree" */

	/**
	 * Set the default options
	 * @returns {Object} options
	 */
	function defaultOptions() {
		return {
			optimistic: false,
			nodejsScope: false,
			impliedStrict: false,
			sourceType: "script", // one of ['script', 'module', 'commonjs']
			ecmaVersion: 5,
			childVisitorKeys: null,
			fallback: "iteration",
		};
	}

	/**
	 * Preform deep update on option object
	 * @param {Record<string, unknown>} target Options
	 * @param {Record<string, unknown>} override Updates
	 * @returns {Record<string, unknown>} Updated options
	 */
	function updateDeeply(target, override) {
		/**
		 * Is hash object
		 * @param {Object} value Test value
		 * @returns {value is Record<string, unknown>} Result
		 */
		function isHashObject(value) {
			return (
				typeof value === "object" &&
				value instanceof Object &&
				!(value instanceof Array) &&
				!(value instanceof RegExp)
			);
		}

		for (const key in override) {
			if (Object.hasOwn(override, key)) {
				const val = override[key];

				if (isHashObject(val)) {
					if (isHashObject(target[key])) {
						updateDeeply(target[key], val);
					} else {
						target[key] = updateDeeply({}, val);
					}
				} else {
					target[key] = val;
				}
			}
		}
		return target;
	}

	/**
	 * Main interface function. Takes an Espree syntax tree and returns the
	 * analyzed scopes.
	 * @function analyze
	 * @param {ESTree.Program} tree Abstract Syntax Tree
	 * @param {Object} providedOptions Options that tailor the scope analysis
	 * @param {boolean} [providedOptions.optimistic=false] the optimistic flag
	 * @param {boolean} [providedOptions.ignoreEval=false] whether to check 'eval()' calls
	 * @param {boolean} [providedOptions.nodejsScope=false] whether the whole
	 * script is executed under node.js environment. When enabled, escope adds
	 * a function scope immediately following the global scope.
	 * @param {boolean} [providedOptions.impliedStrict=false] implied strict mode
	 * (if ecmaVersion >= 5).
	 * @param {string} [providedOptions.sourceType='script'] the source type of the script. one of 'script', 'module', and 'commonjs'
	 * @param {number} [providedOptions.ecmaVersion=5] which ECMAScript version is considered
	 * @param {boolean} [providedOptions.jsx=false] support JSX references
	 * @param {Object} [providedOptions.childVisitorKeys=null] Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
	 * @param {string} [providedOptions.fallback='iteration'] A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
	 * @returns {ScopeManager} ScopeManager
	 */
	function analyze(tree, providedOptions) {
		const options = updateDeeply(defaultOptions(), providedOptions);
		const scopeManager = new ScopeManager(options);
		const referencer = new Referencer(options, scopeManager);

		referencer.visit(tree);

		assert(
			scopeManager.__currentScope === null,
			"currentScope should be null.",
		);

		return scopeManager;
	}

	/** @name module:escope.version */
	const version = "9.1.2"; // x-release-please-version

	/* vim: set sw=4 ts=4 et tw=80 : */

	var scope = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Definition: Definition,
		PatternVisitor: PatternVisitor,
		Reference: Reference,
		Referencer: Referencer,
		Scope: Scope,
		ScopeManager: ScopeManager,
		Variable: Variable,
		analyze: analyze,
		version: version
	});

	return scope;

})();
