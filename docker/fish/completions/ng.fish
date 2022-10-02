# ng help
complete -f -c ng -n '__fish_use_subcommand' -a help -d 'Outputs the usage instructions for all commands or the provided command.'

# ng version
complete -f -c ng -n '__fish_use_subcommand' -a version -d 'Outputs angular-cli version.'
complete -f -A -c ng -n '__fish_seen_subcommand_from version' -l verbose -d 'verbose (Boolean) (Default: false)'
