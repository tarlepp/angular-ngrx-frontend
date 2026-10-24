[[ $- == *i* ]] || return
[[ ${_thefuck_prompt_initialized:-} == true ]] && return

if [[ ! -x /home/node/.local/bin/thefuck ]]; then
    printf '%s\n' 'The Fuck is missing: /home/node/.local/bin/thefuck' >&2
    return 1
fi

case ":$PATH:" in
    *:/home/node/.local/bin:*) ;;
    *) export PATH="/home/node/.local/bin:$PATH" ;;
esac

_thefuck_alias=$(/home/node/.local/bin/thefuck --alias) || return
eval "$_thefuck_alias"
unset _thefuck_alias

_thefuck_prompt() {
    local status=$?
    local entry
    entry=$(HISTTIMEFORMAT= history 1)
    if [[ $entry != "${_thefuck_last_history:-}" ]]; then
        _thefuck_last_history=$entry
        if (( status > 0 && status < 128 )) && [[ -t 0 && -t 1 ]] \
            && [[ $entry =~ ^[[:space:]]*[0-9]+[[:space:]]+(.*)$ ]]; then
            # The generated alias uses fc, which omits the current command at a prompt.
            THEFUCK_REQUIRE_CONFIRMATION=true fuck --force-command "${BASH_REMATCH[1]}"
            _thefuck_last_history=$(HISTTIMEFORMAT= history 1)
        fi
    fi
    return "$status"
}

PROMPT_COMMAND=(_thefuck_prompt "${PROMPT_COMMAND[@]}")
_thefuck_prompt_initialized=true
