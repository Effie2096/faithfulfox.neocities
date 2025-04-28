$badges80 = "/assets/img/badges/80x15/"
$badges150 = "/assets/img/badges/150x20/"
$badges88 = "/assets/img/badges/88x31/"
$stamps = "/assets/img/badges/stamps/"

$outfile = $PSScriptRoot+"/../pages/badges.html"

Clear-Content -Path $outfile

Function AddImages {
	param ($path, $id)

	Add-Content -Path $outfile -Value "<div id=`"$id`" class=`"badge-box`">"
	foreach ($badge in Get-ChildItem -Path $PSScriptRoot/"../"$path) {
		Add-Content -Path $outfile -Value "<img src=`"$path$($badge.Name)`" alt=`"$($badge.Name)`" loading=`"lazy`">"
	}
	Add-Content -Path $outfile -Value '</div>'
	Add-Content -Path $outfile -Value '<hr/>'
}

AddImages $badges80 "smol"
AddImages $badges150 "skinny"
AddImages $badges88 "normal"
AddImages $stamps "stamps"
