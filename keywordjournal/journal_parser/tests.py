# Author: Daniel Kinney
# All rights reserved


import unittest

from keywordjournal.journal_parser import parser


TWO_TAGS_ARGS_GOOD = ""
FLOATING_HASH = "This has a floating # in the middle"
TRAILING_HASH = ""


class TestTagAndArgsParser(unittest.TestCase):
    def test_tag_with_no_args(self):
        text = '#tag'
        tag, args = parser.parse_match(text)
        self.assertEqual(tag, 'tag')
        self.assertEqual(args, {})


    def test_tag_with_one_arg(self):
        text = '#tag(x: 1)'
        tag, args = parser.parse_match(text)
        self.assertEqual(tag, 'tag')
        self.assertEqual(args, {'x': '1'})

    def test_tag_with_two_args(self):
        text = '#tag(x: 1, y:2)'
        tag, args = parser.parse_match(text)
        self.assertEqual(tag, 'tag')
        self.assertEqual(args, {'x': '1', 'y': '2'})


class TestPostParser(unittest.TestCase):
    def test_no_tags(self):
        post = 'This is a post without any tags whatsoever'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {})


    def test_1_tag_no_args(self):
        post = 'This is a post with one #tag without args'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {'tag': [{}]})

    def test_1_tag_with_args(self):
        post = 'This is a post with one #tag(with: args)'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {'tag': [{'with': 'args'}]})

    # Todo: This edge case isn't covered
    # def test_1_tag_bad_tag(self):
    #     post = 'This is a post with one #ta_g without args with illegal characters'
    #     tags_and_args = parser.find_all_keywords_with_args(post)

    def test_1_tag_bad_args(self):
        post = 'This is a post with one #tag(with, args)'
        self.assertRaises(ValueError, parser.find_all_keywords_with_args, post)

    def test_1_tag_distracting_parens(self):
        post = 'This is ) a post ( with one #tag(with: args) ) ('
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {'tag': [{'with': 'args'}]})

    def test_2_tags(self):
        post = 'This is a post with one #tag(with: args) and #another(tag: yay)'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {'tag': [{'with': 'args'}],
                                         'another': [{'tag': 'yay'}]})

    def floating_hash(self):
        post = 'This has a floating # in the middle'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {})

    def trailing_hash(self):
        post = 'This has a trailing #'
        tags_and_args = parser.find_all_keywords_with_args(post)
        self.assertEqual(tags_and_args, {})
