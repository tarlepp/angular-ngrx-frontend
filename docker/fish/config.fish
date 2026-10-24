if type -q thefuck
	thefuck --alias | source

	if status is-interactive
		function _thefuck_postexec --on-event fish_postexec
			set -l exit_status $status
			if test $exit_status -gt 0; and test $exit_status -lt 128; and isatty stdin; and isatty stdout
				set -lx THEFUCK_REQUIRE_CONFIRMATION true
				fuck --force-command "$argv[1]"
			end
			return $exit_status
		end
	end
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
