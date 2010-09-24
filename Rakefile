require 'rubygems'
require 'sprockets'
require 'juicer'
require 'yui/compressor'
require 'uri'

task :default => :prep

ROOT = File.expand_path(File.dirname(__FILE__))

cssinput   = File.join(ROOT, 'src', 'snoopy.css');
cssoutput  = File.join(ROOT, 'snoopy.css');
cssmin     = File.join(ROOT, 'snoopy-min.css');

jsinput   = File.join(ROOT, 'src', 'snoopy.js');
jsoutput  = File.join(ROOT, 'snoopy.js');
jsmin     = File.join(ROOT, 'snoopy-min.js');

bminput   = File.join(ROOT, 'src', 'bookmarklet.js');
bmoutput  = File.join(ROOT, 'bookmarklet.js');

# merge

task :mergecss do
  sh "juicer merge -m none #{cssinput} -o #{cssoutput} --force" # need to do this in ruby...
end

task :mergejs do
  secretary = Sprockets::Secretary.new(
    :source_files => [jsinput]
  )
  concatenation = secretary.concatenation
  concatenation.save_to(jsoutput);
end

task :merge => [:mergejs, :mergecss]

# squash

task :squashcss do
  cssfile = File.open(cssoutput, "r")
  csscompress = YUI::CssCompressor.new
  File.open(cssmin, 'w') { |file| file.write( csscompress.compress( cssfile.read ) ) }
end

task :squashjs do
  jsfile = File.open(jsoutput, "r")
  jscompress = YUI::JavaScriptCompressor.new
  File.open(jsmin, 'w') { |file| file.write( jscompress.compress( jsfile.read ) ) }
end

task :squash => [:squashjs, :squashcss]

task :prepbookmarklet do 
  bmfile = File.open(bminput, "r")
  bmcompress = YUI::JavaScriptCompressor.new
  output = 'javascript:'+URI.escape(bmcompress.compress( bmfile.read ), Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
  File.open(bmoutput, 'w') { |file| file.write( output ) }
end

# do it all!

task :prep => [:merge, :squash, :prepbookmarklet]