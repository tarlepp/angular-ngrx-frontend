if type -q thefuck
	thefuck --alias 2>/dev/null | source
end

# In this container `/usr/bin/open` cannot open remote fish docs.
# Use interactive lynx in a TTY, and non-interactive dump mode otherwise.
if not set -q fish_help_browser
	if type -q lynx
		if test -t 1
			set -gx fish_help_browser lynx
		else
			set -gx fish_help_browser lynx -dump
		end
	end
end

# Abbreviations for common development commands
abbr -a mlint make lint
abbr -a mfix make fix

# Welcome greeting for interactive TTY shells only
if status is-interactive; and test -t 1
	echo "🎣 Welcome to Angular NgRx Frontend development"
	echo ""
	echo "Quick commands:"
	echo "  mlint     → make lint         (lint TS & SCSS)"
	echo "  mfix      → make fix          (auto-fix TS & SCSS)"
	echo "  help      → fish help         (interactive docs)"
	echo ""
end

