$badges80 = Get-ChildItem -Path $PSScriptRoot/"../assets/img/badges/80x15/"
$badges150 = Get-ChildItem -Path $PSScriptRoot/"../assets/img/badges/150x20/"
$badges88 = Get-ChildItem -Path $PSScriptRoot/"../assets/img/badges/88x31/"
$stamps = Get-ChildItem -Path $PSScriptRoot/"../assets/img/badges/stamps/"
$outfile = $PSScriptRoot+"/../pages/badges.html"

Clear-Content -Path $outfile

Add-Content -Path $outfile -Value '<div id="smol" class="badge-box">'
foreach ($badge in $badges80) {
	Add-Content -Path $outfile -Value "<img src=`"/assets/img/badges/80x15/$($badge.Name)`" alt=`"$($badge.Name)`">"
}
Add-Content -Path $outfile -Value '</div>'

Add-Content -Path $outfile -Value '<div id="skinny" class="badge-box">'
foreach ($badge in $badges150) {
	Add-Content -Path $outfile -Value "<img src=`"/assets/img/badges/150x20/$($badge.Name)`" alt=`"$($badge.Name)`">"
}
Add-Content -Path $outfile -Value '</div>'

Add-Content -Path $outfile -Value '<div id="normal" class="badge-box">'
foreach ($badge in $badges88) {
	Add-Content -Path $outfile -Value "<img src=`"/assets/img/badges/88x31/$($badge.Name)`" alt=`"$($badge.Name)`">"
}
Add-Content -Path $outfile -Value '</div>'

Add-Content -Path $outfile -Value '<div id="stamps" class="badge-box">'
foreach ($badge in $stamps) {
	Add-Content -Path $outfile -Value "<img src=`"/assets/img/badges/stamps/$($badge.Name)`" alt=`"$($badge.Name)`">"
}
Add-Content -Path $outfile -Value '</div>'
