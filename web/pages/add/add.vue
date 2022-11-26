<template lang="pug">
    .page-add
        left-menu
            tab-bar(slot="menu", :list="tabBar.list", :active-index="tabBar.selectedIndex")
            form.weui-form.mp-form(slot="content")
                .weui-toptips.weui-toptips_warn(v-show="form.error.isShow") {{form.error.msg}}
                .handler(v-if="addDisabled")
                    a.btn.block.weui-btn.weui-btn_default(@click="showRecord") {{btnShowAllRecordTitle}}
                .weui-msg.mp-msg(v-else-if="msg.isShow")
                    .weui-msg__icon-area
                        i.weui-icon-success.weui-icon_msg
                    .weui-msg__text-area
                        h2.weui-msg__title {{msg.title}}
                        p.weui-msg__desc {{msg.desc}}
                    .weui-msg__opr-area
                        p.weui-btn-area(v-for="item in msg.button", :key="item.handlerType")
                            a.btn.block.weui-btn(:class="item.classType==='primary' ? 'weui-btn_primary' : 'weui-btn_default'", @click="msgEventHandler(item.handlerType)") {{item.title}}
                .weui-form-container(v-else)
                    mp-gallery(:isShow="gallery.isShow", :image="gallery.imageUrl", :isShowDelete="true", @eventHandler="galleryEventHandler")
                    .weui-form__control-area
                        .weui-cells__group.weui-cells__group_form.weui-cells
                            .weui-cells
                                .weui-cell.weui-cell_active
                                    .weui-cell__hd
                                        label.weui-label(:for="form.msgType.name") {{form.msgType.tip}}
                                    .weui-cell__bd
                                        input.weui-input.input(:id="form.msgType.name", type="text", v-model="form.msgType.value === form.msgType.enum.investigate.value ? form.msgType.enum.investigate.title : form.msgType.enum.deal.title", readonly)
                                .weui-cell.weui-cell_active(v-show="handlerType === 'edit'")
                                    .weui-cell__hd
                                        label.weui-label {{form.codeNumber.title}}
                                    .weui-cell__bd
                                        input.weui-input.input(type="text", v-model="form.codeNumber.value")
                        .weui-form-container(v-show="form.msgType.value === form.msgType.enum.deal.value")
                            .weui-cells
                                .weui-cell.weui-cell_active.weui-cell_select.weui-cell_select-after
                                    .weui-cell__hd
                                        label.weui-label {{form.belongArea.title}}
                                    .weui-cell__bd.weui-select
                                        select.weui-select(@change="selectBelongArea")
                                            option(v-for="(item, index) in form.belongArea.list", :value="index", :selected="index === form.belongArea.selectedIndex ? 'selected' : ''") {{item.regionName}}
                                .weui-cell.weui-cell_active.weui-cell_select.weui-cell_select-after
                                    .weui-cell__hd
                                        label.weui-label {{form.targetUnit.title}}
                                    .weui-cell__bd.weui-select
                                        select.weui-select(@change="selectTargetUnit")
                                            option(v-for="(item, index) in form.targetUnit.list", :value="index", :selected="index === form.targetUnit.selectedIndex ? 'selected' : ''") {{item.regionName}}
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.buildType.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(item, index) in form.buildType.list", :key="item.value", :for="'build-type-' + index", @click="buildTypeChange(item.value)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'build-type-' + index", :checked="form.buildType.selectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells

                            .weui-cell.weui-cell_active
                                .weui-cell__hd
                                    label.weui-label(:for="form.buildArea.name") {{form.buildArea.title + "（" + form.buildArea.valueUnit + "）"}}
                                .weui-cell__bd
                                    input.weui-input.input(:id="form.buildArea.name", type="number", v-model="form.buildArea.value", :placeholder="form.buildArea.placeHolder")
                            .weui-cell.weui-cell_active
                                .weui-cell__hd
                                    label.weui-label(:for="form.buildSituation.name") {{form.buildSituation.title}}
                                .weui-cell__bd
                                    input.weui-input.input(type="text", v-model="form.buildSituation.value", :placeholder="form.buildSituation.placeHolder", :id="form.buildSituation.name")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title
                                .weui-cells
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.buildName.name") {{form.buildName.title}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="form.buildName.name", type="text", v-model="form.buildName.value", :placeholder="form.buildName.placeHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd {{form.missionDate.title}}
                                        .weui-cell__bd(@click="showDatePicker('missionDate')") {{form.missionDate.value || form.missionDate.placeHolder}}
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.beforePhoto.title}}
                                .weui-cells
                                    .weui-cell.weui-cell_uploader
                                        .weui-cell__bd
                                            .weui-uploader__hd
                                                .weui-uploader__title
                                                .weui-uploader__info {{form.beforePhoto.value.length}}/{{form.beforePhoto.maxCount}}
                                            .weui-uploader__bd
                                                ul.weui-uploader__files
                                                    .weui-uploader__file(v-for="(i, index) in form.beforePhoto.value", :key="i.url", :style="'background: url(' + i.url + ');background-size: cover;'", :class="i.error || i.loading ? 'weui-uploader__file_status' : ''", @click="uploadPhotoClick(index, 'beforePhoto', i.url)")
                                                        .weui-uploader__file-content(v-show="i.error || i.loading")
                                                            | {{i.loading ? loadingTitle : ''}}
                                                            i.weui-icon-warn(v-show="i.error")
                                                .weui-uploader__input-box(v-show="form.beforePhoto.value.length < form.beforePhoto.maxCount")
                                                    input.weui-uploader__input(type="file", accept="image/*", multiple, @change="selectedUploadFile($event, 'beforePhoto')")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.dealingPhoto.title}}
                                .weui-cells
                                    .weui-cell.weui-cell_uploader
                                        .weui-cell__bd
                                            .weui-uploader__hd
                                                .weui-uploader__title
                                                .weui-uploader__info {{form.dealingPhoto.value.length}}/{{form.dealingPhoto.maxCount}}
                                            .weui-uploader__bd
                                                ul.weui-uploader__files
                                                    .weui-uploader__file(v-for="(i, index) in form.dealingPhoto.value", :key="i.url", :style="'background: url(' + i.url + ');background-size: cover;'", :class="i.error || i.loading ? 'weui-uploader__file_status' : ''", @click="uploadPhotoClick(index, 'dealingPhoto', i.url)")
                                                        .weui-uploader__file-content(v-show="i.error || i.loading")
                                                            | {{i.loading ? loadingTitle : ''}}
                                                            i.weui-icon-warn(v-show="i.error")
                                                .weui-uploader__input-box(v-show="form.dealingPhoto.value.length < form.dealingPhoto.maxCount")
                                                    input.weui-uploader__input(type="file", accept="image/*", multiple, @change="selectedUploadFile($event, 'dealingPhoto')")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.donePhoto.title}}
                                .weui-cells
                                    .weui-cell.weui-cell_uploader
                                        .weui-cell__bd
                                            .weui-uploader__hd
                                                .weui-uploader__title
                                                .weui-uploader__info {{form.donePhoto.value.length}}/{{form.donePhoto.maxCount}}
                                            .weui-uploader__bd
                                                ul.weui-uploader__files
                                                    .weui-uploader__file(v-for="(i, index) in form.donePhoto.value", :key="i.url", :style="'background: url(' + i.url + ');background-size: cover;'", :class="i.error || i.loading ? 'weui-uploader__file_status' : ''", @click="uploadPhotoClick(index, 'donePhoto', i.url)")
                                                        .weui-uploader__file-content(v-show="i.error || i.loading")
                                                            | {{i.loading ? loadingTitle : ''}}
                                                            i.weui-cion-warn(v-show="i.error")
                                                .weui-uploader__input-box(v-show="form.donePhoto.value.length < form.donePhoto.maxCount")
                                                    input.weui-uploader__input(type="file", accept="image/*", multiple, @change="selectedUploadFile($event, 'donePhoto')")
                        .weui-form-container(v-show="form.msgType.value === form.msgType.enum.investigate.value")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.buildingAddress.name") {{form.buildingAddress.title}}
                                        .weui-cell__bd
                                            input.weui-input.input(type="text", :id="form.buildingAddress.name", v-model="form.buildingAddress.value", :placeholder="form.buildingAddress.placeHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.propertyOwner.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(item, index) in form.propertyOwner.type.list", :key="item.value", :for="'property-owner-type-' + index", @click="selectPropertyOwnerType(item.value)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'property-owner-type-' + index", :checked="form.propertyOwner.type.selectedValue === item.value ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells(v-show="form.propertyOwner.type.selectedValue !== propertyOwnerTypeEnum.unknown.value")
                                .weui-cells__title {{form.propertyOwner.name.title}}
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.propertyOwner.name.name") {{form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.unit.value ? form.propertyOwner.name.unitTitle : form.propertyOwner.name.personalTitle}}
                                        .weui-cell__bd
                                            input.weui-input.input(type="text", :id="form.propertyOwner.name.name", v-model="form.propertyOwner.name.value", :placeholder="form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.unit.value ? form.propertyOwner.name.unitPlaceHolder : form.propertyOwner.name.personalPlaceHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells(v-show="form.propertyOwner.type.selectedValue !== propertyOwnerTypeEnum.unknown.value")
                                .weui-cells__title {{form.propertyOwner.credentialsType.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-show="form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.unit.value", v-for="(item, index) in form.propertyOwner.credentialsType.unitList", :key="item.value", :for="'unit-credentials-type-' + index", @click="selectCredentialsType(index)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'unit-credentials-type-' + index", :checked="form.propertyOwner.credentialsType.unitSelectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                                    label.weui-cell.weui-cell_active.weui-check__label(v-show="form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.personal.value", v-for="(item, index) in form.propertyOwner.credentialsType.personalList", :key="item.value", :for="'personal-credentials-type-' + index", @click="selectCredentialsType(index)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'personal-credentials-type-' + index", :checked="form.propertyOwner.credentialsType.personalSelectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells(v-show="form.propertyOwner.type.selectedValue !== propertyOwnerTypeEnum.unknown.value")
                                .weui-cells
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.propertyOwner.credentialsNumber.name") {{form.propertyOwner.credentialsNumber.title}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="form.propertyOwner.credentialsNumber.name", type="text", v-model="form.propertyOwner.credentialsNumber.value", :placeholder="form.propertyOwner.credentialsNumber.placeHolder")
                            .weui-cells__group.weui-cells__group_form(v-show="form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.unit.value")
                                .weui-cell.weui-cell_active.weui-cell_switch(@click="toggleIsGovernment")
                                    .weui-cell__bd {{form.propertyOwner.relative.government.title}}
                                    .weui-cell__ft
                                        input.weui-switch(type="checkbox", :id="form.propertyOwner.relative.government.name", :checked="form.propertyOwner.relative.government.selected ? 'checked' : ''")
                            .weui-cells__group.weui-cells__group_form(v-show="form.propertyOwner.type.selectedValue === propertyOwnerTypeEnum.unit.value")
                                .weui-cell.weui-cell_active.weui-cell_switch(@click="toggleIsArmedForces")
                                    .weui-cell__bd {{form.propertyOwner.relative.armedForces.title}}
                                    .weui-cell__ft
                                        input.weui-switch(type="checkbox", :id="form.propertyOwner.relative.armedForces.name", :checked="form.propertyOwner.relative.armedForces.selected ? 'checked' : ''")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.belongType.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(item, index) in form.belongType.list", :key="item.value", :for="'belong-type-' + index", @click="selectBelongTypeByIndex(index)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'belong-type-' + index", :checked="form.belongType.selectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.landType.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(item, index) in form.landType.list", :key="item.value", :for="'land-type-' + index", @click="selectLandTypeByIndex(index)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'land-type-' + index", :checked="form.landType.selectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form
                                .weui-cell.weui-cell_active.weui-cell_switch(@click="toggleCurtilage")
                                    .weui-cell__bd {{form.curtilage.title}}
                                    .weui-cell__ft
                                        input.weui-switch(type="checkbox", :checked="form.curtilage.selected ? 'checked' : ''")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.coverArea.name") {{form.coverArea.title + "（" + form.coverArea.valueUnit + "）"}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="form.coverArea.name", type="number", v-model="form.coverArea.value", :placeHolder="form.coverArea.placeHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.buildArea.name + '-investigate'") {{form.buildArea.title + "（" + form.buildArea.valueUnit + "）"}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="form.buildArea.name + '-investigate'", type="number", v-model="form.buildArea.value", :placeholder="form.buildArea.placeHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="form.buildingStorey.name") {{form.buildingStorey.title}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="form.buildingStorey.name", type="number", v-model="form.buildingStorey.value", :placeholder="form.buildingStorey.placeHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd {{form.buildingStartDate.title}}
                                        .weui-cell__bd(@click="showDatePicker('buildingStartDate')") {{form.buildingStartDate.value || form.buildingStartDate.placeHolder}}
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd {{form.buildingEndDate.title}}
                                        .weui-cell__bd(@click="showDatePicker('buildingEndDate')") {{form.buildingEndDate.value || form.buildingEndDate.placeHolder}}
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.engineeringSituation.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(item, index) in form.engineeringSituation.list", :key="item.value", :for="'engineering-situation-' + index", @click="selectEngineeringSituationByIndex(index)")
                                        .weui-cell__bd
                                            p {{item.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'engineering-situation-' + index", :checked="form.engineeringSituation.selectedIndex === index ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title {{form.engineeringAge.title}}
                                .weui-cells.weui-cells_radio
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(ea, eIndex) in form.engineeringAge.list", :key="ea.value", :for="'engineering-age-' + eIndex", @click="selectEngineeringAgeByIndex(eIndex)")
                                        .weui-cell__bd
                                            p {{ea.title}}
                                        .weui-cell__ft
                                            input.weui-check(type="radio", :id="'engineering-age-' + eIndex", :checked="form.engineeringAge.selectedIndex === eIndex ? 'checked' : ''")
                                            span.weui-icon-checked
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cells__title {{form.useFor.title}}
                                .weui-cells.weui-cells_checkbox
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(uf, uIndex) in form.useFor.list", :key="uf.value")
                                        .weui-cell__hd
                                            input.weui-check(type="checkbox", name="use-for", :checked="uf.checked ? 'checked' : ''", @click="selectUseFor(uIndex)")
                                            i.weui-icon-checked
                                        .weui-cell__bd
                                            p.text {{uf.title}}
                            .weui-cells__group.weui-cells__group_form(v-for="(cert, certIndex) in form.certificate.list")
                                .weui-cell.weui-cell_active.weui-cell_switch(@click="toggleCertificate(certIndex)")
                                    .weui-cell__bd {{cert.title}}
                                    .weui-cell__ft
                                        input.weui-switch(type="checkbox", :checked="cert.selected ? 'checked' : ''")
                                .weui-cells.weui-cells_radio(v-show="cert.selected && cert.nameTitle")
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="'certificate-name-' + certIndex") {{cert.nameTitle}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="'certificate-name-' + certIndex", v-model="cert.nameValue", :placeholder="cert.nameTitle")
                                .weui-cells.weui-cells_radio(v-show="cert.selected && cert.numberTitle")
                                    .weui-cell.weui-cell_active
                                        .weui-cell__hd
                                            label.weui-label(:for="'certificate-number-' + certIndex") {{cert.numberTitle}}
                                        .weui-cell__bd
                                            input.weui-input.input(v-show="cert.selected", type="text", :id="'certificate-number-' + certIndex",  v-model="cert.numberValue", :placeholder="form.certificate.numberPlaceHolder")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cells__title {{form.illegalType.title}}
                                .weui-cells.weui-cells_checkbox
                                    label.weui-cell.weui-cell_active.weui-check__label(v-for="(it, iIndex) in form.illegalType.list", :key="it.value")
                                        .weui-cell__hd
                                            input.weui-check(type="checkbox", name="illegal-type", :checked="it.checked ? 'checked' : ''", @click="selectIllegalType(iIndex)")
                                            i.weui-icon-checked
                                        .weui-cell__bd
                                            p.text {{it.title}}
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells
                                    .weui-cells__title {{form.otherEvidence.title}}
                            .weui-cells__group.weui-cells__group_form(v-for="(oe, oIndex) in form.otherEvidence.list", :key="oe.value")
                                .weui-cell.weui-cell_active.weui-cell_switch(@click="selectOtherEvidenceByIndex(oIndex)")
                                    .weui-cell__bd {{oe.title}}
                                    .weui-cell__ft
                                        input.weui-switch(type="checkbox", :checked="oe.selected ? 'checked' : ''")
                                .weui-cells.weui-cells_radio(v-show="oe.selected")
                                    .weui-cell.weui-cell_uploader
                                        .weui-cell__bd
                                            .weui-uploader__hd
                                                .weui-uploader__info {{oe.filePaths.length}}/{{oe.maxCount}}
                                            .weui-uploader__bd
                                                ul.weui-uploader__files
                                                    .weui-uploader__file(v-for="(i, index) in oe.filePaths", :key="i.url", :style="'background: url(' + i.url + ');background-size: cover;'", :class="i.error || i.loading ? 'weui-uploader__file_status' : ''", @click="uploadPhotoClick(index, 'otherEvidence', i.url,  {index: oIndex})")
                                                        .weui-uploader__file-content(v-show="i.error || i.loading")
                                                            | {{i.loading ? loadingTitle : ''}}
                                                            i.weui-icon-warn(v-show="i.error")
                                                .weui-uploader__input-box(v-show="oe.filePaths.length < oe.maxCount")
                                                    input.weui-uploader__input(type="file", accept="image/*", multiple, @change="selectedUploadFile($event, form.otherEvidence.fileUpdateEventType, {index: oIndex})")
                            .weui-cells__group.weui-cells__group_form.weui-cells
                                .weui-cells__title
                                .weui-cells.weui-cells_radio
                                    .weui-cell.weui-cell_active(v-for="joiner in form.joinerMsg.list")
                                        .weui-cell__hd
                                            label.weui-label(:for="joiner.name") {{joiner.title}}
                                        .weui-cell__bd
                                            input.weui-input.input(:id="joiner.name", type="text", v-model="joiner.value", :placeholder="joiner.placeHolder")
                    .weui-form__opr-area.button.control
                        a.weui-btn.weui-btn_primary.size-default.type-primary.btn-submit.btn.block(:class="form.submit.disabled ? 'weui-btn_disabled' : ''", type="button", @click="submitInfo") {{form.submit.title}}
</template>

<script>
    import "babel-polyfill";
    import App from "../../utils/app";
    import "../../public/libs/weui/weui.min.js";
    import {cn} from "../../../appConfig/cn";
    import bindData from "../../../appConfig/bindData";
    import {memberRoute} from "../../../appConfig/route";
    import baseConfig from "../../../appConfig/baseConfig";
    import tabBarConfig from "../../config/tabBar";
    import {ProviderMissionRecord, AdapterMissionRecord} from "../../provider/missionRecord";
    import {UserProvider} from "../../provider/user";
    import {ProviderSetting, nsSettingResponse} from "../../provider/setting";
    import {util} from "../../utils/util";
    import {PingYin} from "../../utils/getPingYin";
    import {DateUtil} from "../../utils/date";
    import {Request} from "../../utils/request";
    import TabBar from "../../layout/tabBar";
    import LeftMenu from "../../layout/leftMenu";
    import MpGallery from "../../component/mp-gallery";

    let app;
    //  上传图片结构
    const getUploadImageFileArr = () => {
            return [];
        }
        , userDataPromise = new Promise((resolve, reject) => {
            app = new App(isOk => isOk ? resolve() : reject());
        })
    ;
    let dateString = ""
        , regionList = []
    ;

    export default {
        name: "add",
        components: {
            TabBar,
            LeftMenu,
            MpGallery
        },
        data() {
            return {
                tabBar: {
                    selectedIndex: tabBarConfig.list.findIndex(
                        item => item.pagePath.indexOf(memberRoute.add) > -1
                    ),
                    list: tabBarConfig.list.map(item => {
                        return {
                            iconNormalPath: item.iconPath,
                            iconActivePath: item.selectedIconPath,
                            link: item.pagePath,
                            title: item.text
                        };
                    })
                },
                userRankEnum: bindData.userRank.enum,
                propertyOwnerTypeEnum: bindData.propertyOwnerType.enum, //  权属人类型
                unitCredentialsTypeEnum: bindData.unitCredentialsType.enum, //  单位证件类型
                personalCredentialsTypeEnum: bindData.personalCredentialsType.enum,  //  个人证件类型
                belongTypeEnum: bindData.belongType.enum,   //  所处区域
                landTypeEnum: bindData.landType.enum,   //  土地性质
                engineeringSituationTypeEnum: bindData.engineeringSituationType.enum,   //  工程现状类型
                engineeringAgeTypeEnum: bindData.engineeringAgeType.enum,   //  违建类型（新旧）
                useForTypeEnum: bindData.useForType.enum,   //  用途类型
                illegalTypeEnum: bindData.illegalType.enum, //  违建性质
                certificateEnum: bindData.certificate.enum, //  证书类型
                otherEvidenceTypeEnum: bindData.otherEvidence.enum, //  其他证据
                addDisabled: false,
                btnShowAllRecordTitle: cn.missionRecord.btnShowAllRecordTitle,
                loadingTitle: cn.global.load.loading,
                handlerType: "", //  操作类型
                pingYin: new PingYin(),
                providerUser: new UserProvider(),
                providerMissionRecord: new ProviderMissionRecord(),
                providerSetting: new ProviderSetting(),
                msg: {
                    isShow: false,
                    type: "success",
                    title: cn.missionRecord.addSuccessTitle,
                    desc: cn.missionRecord.addSuccessDescript,
                    id: 0,
                    button: [
                        {
                            title: cn.missionRecord.continueAddBtnTitle,
                            classType: "primary",
                            handlerType: "continueAdd"
                        },
                        {
                            title: cn.missionRecord.showResultBtnTitle,
                            classType: "default",
                            handlerType: "showResult"
                        }
                    ]
                },
                gallery: {
                    isShow: false,
                    imageUrl: "",
                    targetData: {
                        index: -1,
                        type: "",
                        custom: {}
                    }
                },
                form: {
                    dealId: 0, //
                    investigateId: 0,
                    fileMaxCount: baseConfig.fileMaxCount,
                    tips: {
                        pleaseInput: cn.global.tips.pleaseInput,
                        pleaseSelect: cn.global.tips.pleaseSelect,
                        pleaseUpload: cn.global.tips.pleaseUpload
                    },
                    error: {
                        msg: cn.missionRecord.topTip,
                        isShow: true
                    },
                    msgType: {
                        tip: cn.missionRecord.msgTypeTip,
                        name: "msgType",
                        enum: bindData.missionType.enum,
                        value: -1 //  选择的类型
                    },
                    codeNumber: {
                        title: cn.missionRecord.codeNumberTitle,
                        value: 0
                    },
                    //  建筑物详细地址（摸查）
                    buildingAddress: {
                        title: cn.missionRecord.buildingAddressTitle,
                        placeHolder: cn.missionRecord.buildingAddressPlaceHolder,
                        name: "buildingAddress",
                        value: ""
                    },
                    //  权属人信息（摸查）
                    propertyOwner: {
                        title: cn.missionRecord.propertyOwnerTypeTitle,
                        type: {
                            selectedValue: 0,
                            list: []
                        },
                        //  权属人姓名或者公司名称
                        name: {
                            title: cn.missionRecord.propertyOwnerInfoTitle,
                            unitTitle: cn.missionRecord.unitNameTitle,
                            unitPlaceHolder: cn.missionRecord.unitNamePlaceHolder,
                            personalTitle: cn.missionRecord.personalNameTitle,
                            personalPlaceHolder: cn.missionRecord.personalNamePlaceHolder,
                            name: "property-owner-name",
                            value: ""
                        },
                        //  证件类型
                        credentialsType: {
                            title: cn.missionRecord.credentialsTypeTitle,
                            unitSelectedIndex: 0,
                            unitList: [],
                            personalSelectedIndex: 0,
                            personalList: []
                        },
                        //  证件号
                        credentialsNumber: {
                            title: cn.missionRecord.credentialsNumberTitle,
                            placeHolder: cn.missionRecord.credentialsNumberPlaceHolder,
                            name: "credentialsNumber",
                            value: ""
                        },
                        //  从属、依赖关系
                        relative: {
                            government: {
                                title: cn.missionRecord.withGovernmentTitle,
                                name: "relative-government",
                                selected: false
                            },
                            armedForces: {
                                title: cn.missionRecord.withArmedForcesTitle,
                                name: "relative-armed-forces",
                                selected: false
                            }
                        }
                    },
                    //  所处区域
                    belongType: {
                        title: cn.missionRecord.belongTypeTitle,
                        selectedIndex: 0,
                        list: []
                    },
                    //  土地性质
                    landType: {
                        title: cn.missionRecord.landTypeTitle,
                        selectedIndex: 0,
                        list: []
                    },
                    //  宅基地判断
                    curtilage: {
                        title: cn.missionRecord.curtilageTitle,
                        name: "curtilage",
                        selected: false
                    },
                    //  占地面积
                    coverArea: {
                        title: cn.missionRecord.coverAreaTitle,
                        placeHolder: cn.missionRecord.coverAreaPlaceHolder,
                        name: "coverArea",
                        value: "",
                        valueUnit: cn.missionRecord.buildAreaValueUnit
                    },
                    //  建筑层数
                    buildingStorey: {
                        title: cn.missionRecord.buildingStoreyTitle,
                        placeHolder: cn.missionRecord.buildingStoreyPlaceHolder,
                        name: "buildingStorey",
                        value: ""
                    },
                    //  建筑时间
                    buildingStartDate: {
                        title: cn.missionRecord.buildStartDateTitle,
                        name: "buildingStartDate",
                        placeHolder: cn.missionRecord.buildStartDatePlaceHolder,
                        startDate: dateString,
                        endDate: dateString,
                        value: dateString
                    },
                    //  竣工时间
                    buildingEndDate: {
                        title: cn.missionRecord.buildEndDateTitle,
                        name: "buildingEndData",
                        placeHolder: cn.missionRecord.buildEndDatePlaceHolder,
                        startDate: dateString,
                        endDate: dateString,
                        value: dateString
                    },
                    //  工程现状
                    engineeringSituation: {
                        title: cn.missionRecord.engineeringSituationTitle,
                        selectedIndex: 0,
                        list: []
                    },
                    //  违建类型（新旧）
                    engineeringAge: {
                        title: cn.missionRecord.engineeringAgeTitle,
                        selectedIndex: 0,
                        list: []
                    },
                    //  用途
                    useFor: {
                        title: cn.missionRecord.useForTitle
                        , name: "useFor"
                        , list: []  //  可选的项
                    },
                    //  证书
                    certificate: {
                        title: cn.missionRecord.certificateTitle,
                        numberPlaceHolder: cn.missionRecord.certificateNumberPlaceHolder,
                        list: []
                    },
                    //  违建性质类型
                    illegalType: {
                        title: cn.missionRecord.illegalTypeTitle,
                        name: "illegalType",
                        list: []
                    },
                    //  其他证据
                    otherEvidence: {
                        title: cn.missionRecord.otherEvidenceTitle,
                        fileUpdateEventType: 'otherEvidence',   //  文件上传事件类型
                        list: []
                    },
                    //  参与者信息
                    joinerMsg: {
                        list: [
                            //  填报人
                            {
                                title: cn.missionRecord.reporterTitle,
                                placeHolder: cn.missionRecord.reporterPlaceHolder,
                                name: "reporter",
                                value: ""
                            },
                            //  复核人
                            {
                                title: cn.missionRecord.confirmerTitle,
                                placeHolder: cn.missionRecord.confirmerPlaceHolder,
                                name: "confirmer",
                                value: ""
                            },
                            //  负责人
                            {
                                title: cn.missionRecord.leaderTitle,
                                placeHolder: cn.missionRecord.leaderPlaceHolder,
                                name: "leader",
                                value: ""
                            }
                        ]
                    },
                    //  母标所属上级地区
                    belongArea: {
                        title: cn.missionRecord.belongDistrictTitle,
                        name: "belongArea",
                        value: "",
                        selectedIndex: -1,
                        list: regionList
                    },
                    //  目标区域
                    targetUnit: {
                        title: cn.missionRecord.targetStreetTitle,
                        name: "targetUnit",
                        value: "",
                        selectedIndex: -1,
                        list: regionList
                    },
                    //  建设类型
                    buildType: {
                        title: cn.missionRecord.buildTypeTitle,
                        name: "buildType",
                        selectedIndex: 0, //  选择的索引值
                        list: [
                            bindData.missionBuildType.enum.farmer,
                            bindData.missionBuildType.enum.other
                        ]
                    },
                    //  建筑名称
                    buildName: {
                        title: cn.missionRecord.buildNameTitle,
                        name: "buildName",
                        placeHolder: cn.missionRecord.buildNamePlaceHolder,
                        value: ""
                    },
                    //  建筑面积（摸查和治理都有用）
                    buildArea: {
                        title: cn.missionRecord.buildAreaTitle,
                        name: "buildArea",
                        placeHolder: cn.missionRecord.buildAreaPlaceHolder,
                        value: "",
                        valueUnit: cn.missionRecord.buildAreaValueUnit
                    },
                    //  建筑现状
                    buildSituation: {
                        title: cn.missionRecord.buildSituationTitle,
                        name: "buildSituation",
                        placeHolder: cn.missionRecord.buildSituationPlaceHolder,
                        value: ""
                    },
                    //  任务日期
                    missionDate: {
                        title: cn.missionRecord.dealMissionDateTitle,
                        name: "missionDate",
                        placeHolder: cn.missionRecord.missionDatePlaceHolder,
                        startDate: dateString, //  开始可选的时间
                        endDate: dateString, //  结束可选时间
                        value: dateString //  显示的值
                    },
                    //  治理拆除前
                    beforePhoto: {
                        title: cn.missionRecord.dealBeforePhotoTitle,
                        name: "beforePhoto",
                        maxCount: baseConfig.fileMaxCount,
                        value: getUploadImageFileArr()
                    },
                    //  治理拆除中
                    dealingPhoto: {
                        title: cn.missionRecord.dealingPhotoTitle,
                        name: "dealingPhoto",
                        maxCount: baseConfig.fileMaxCount,
                        value: getUploadImageFileArr()
                    },
                    //  治理拆除后
                    donePhoto: {
                        title: cn.missionRecord.dealDonePhotoTitle,
                        name: "donePhoto",
                        maxCount: baseConfig.fileMaxCount,
                        value: getUploadImageFileArr()
                    },
                    submit: {
                        disabled: false,
                        title: cn.missionRecord.submitInfoBtnTitle
                    }
                }
            };
        },
        methods: {
            showRecord() {
                util.switchTo({
                    url: memberRoute.index
                });
            },
            //  画板事件处理
            galleryEventHandler({eventType, data}) {
                switch (eventType) {
                    case "clickImg":
                        this.gallery.isShow = false;
                        break;
                    case "clickDelete":
                        const {targetData} = this.gallery;

                        if (this.gallery.targetData.type === "otherEvidence") {
                            this.form.otherEvidence.list[targetData.custom.index].filePaths.splice(targetData.index, 1);
                        } else {
                            this.form[this.gallery.targetData.type].value.splice(targetData.index, 1);
                        }
                        this.gallery.isShow = false;
                        break;
                    default:
                        util.showToast("无法处理的事件类型");
                        break;
                }
            },
            //  消息提示下一步动作处理
            msgEventHandler(type) {
                switch (type) {
                    case "continueAdd":
                        this.resetAll();
                        break;
                    case "showResult":
                        const {id} = this.msg;

                        if (id !== 0) {
                            util.navigatorTo({
                                url: memberRoute.missionRecordDetail,
                                query: {
                                    [this.form.msgType.value ===
                                    this.form.msgType.enum.investigate.value
                                        ? baseConfig.query.investigateMissionRecordId
                                        : baseConfig.query.dealMissionRecordId]: id,
                                    msgType: this.form.msgType.value
                                }
                            });
                        } else {
                            util.showToast(cn.global.recordNoFound);
                        }
                        break;
                    default:
                        util.showToast("无法处理的点击类型：" + JSON.stringify(e));
                        break;
                }
            },
            //  清除所有已填入的数据
            resetAll() {
                let {form} = this;

                this.msg.isShow = false;
                this.msg.id = 0;
                this.form.dealId = 0;
                this.form.investigateId = 0;
                this.form.msgType.value = form.msgType.enum.investigate.value;
                if (this.form.msgType.value === this.form.msgType.enum.investigate.value) {
                    this.form.buildingAddress.value = "";
                    this.form.propertyOwner.type.selectedValue = this.form.propertyOwner.type.list[0].value;
                    this.form.propertyOwner.name.value = "";
                    this.form.propertyOwner.credentialsType.unitSelectedIndex = 0;
                    this.form.propertyOwner.credentialsType.personalSelectedIndex = 0;
                    this.form.propertyOwner.credentialsNumber.value = "";
                    this.form.propertyOwner.relative.government.selected = this.form.propertyOwner.relative.armedForces.selected = false;
                    this.form.belongType.selectedIndex = 0;
                    this.form.landType.selectedIndex = 0;
                    this.form.curtilage.selected = false;
                    this.form.coverArea.value = "";
                    this.form.buildingStorey.value = "";
                    this.form.buildingStartDate.value = this.form.buildingEndDate.value = "";
                    this.form.engineeringSituation.selectedIndex = 0;
                    this.form.engineeringAge.selectedIndex = 0;
                    this.form.useFor.list.forEach(item => item.checked = false);
                    this.form.certificate.list.forEach(item => {
                        item.selected = false;
                        item.nameValue && (item.nameValue = "");
                        item.numberValue && (item.numberValue = "");
                    });
                    this.form.illegalType.list.forEach(item => item.checked = false);
                    this.form.otherEvidence.list.forEach(item => {
                        item.selected = false;
                        item.filePaths = [];
                    });
                    this.form.joinerMsg.list.forEach(item => item.value = "");
                } else {
                    this.form.buildType.selectedIndex = 0;
                    this.form.belongArea.value = "";
                    this.form.buildName.value = "";
                    this.form.targetUnit.value = "";
                    this.form.buildSituation.value = "";
                    this.form.beforePhoto.value = [];
                    this.form.dealingPhoto.value = [];
                    this.form.donePhoto.value = [];
                    this.form.missionDate.value = "";
                }
                this.form.buildArea.value = "";
                this.handlerType = "add";
            },
            //  选择归属地区
            selectBelongArea(e) {
                const newIndex = Number(e.target.selectedIndex);

                if (this.form.belongArea.selectedIndex !== newIndex) {
                    this.form.belongArea.selectedIndex = newIndex;
                    this.form.belongArea.value = this.form.belongArea.list[
                        this.form.belongArea.selectedIndex
                        ].regionName;
                    //  重选了归属地区后同样重置辖区
                    this.form.targetUnit.value = "";
                    this.form.targetUnit.selectedIndex = 0;
                    this.initTargetStreet();
                }
            },
            //  选择辖区
            selectTargetUnit(e) {
                this.form.targetUnit.selectedIndex = Number(e.target.selectedIndex);
                this.form.targetUnit.value = this.form.targetUnit.list[
                    this.form.targetUnit.selectedIndex
                    ].regionName;
            },
            //  提交表单
            submitInfo() {
                let {form} = this,
                    editMissionRecordPromise,
                    accessToken = this.providerUser.getAccessToken(),
                    //  治理信息验证
                    dealPreChecker = () => {
                        const photoChecker = targetData=> targetData.length === 0 || targetData.findIndex(item=> (item.loading === false && item.error === true) || item.url === "") > -1;
                        let errorMsg = "";

                        switch (true) {
                            case !app.globalData.isSignIn:
                                errorMsg = cn.user.noSignIn;
                                break;
                            //  验证是否都已经输入完成
                            case this.form.buildType.selectedIndex === -1:
                                errorMsg = `${this.form.tips.pleaseInput + this.form.buildType.title}！`;
                                break;
                            case this.form.belongArea.value === "":
                                errorMsg = `${this.form.tips.pleaseInput + this.form.belongArea.title}！`;
                                break;
                            case this.form.buildName.value === "":
                                errorMsg = `${this.form.tips.pleaseInput + this.form.buildName.title}！`;
                                break;
                            case this.form.targetUnit.value === "":
                                errorMsg = `${this.form.tips.pleaseInput + this.form.targetUnit.title}！`;
                                break;
                            case photoChecker(form.beforePhoto.value):
                                errorMsg = `${this.form.tips.pleaseUpload + form.beforePhoto.title}！`;
                                break;
                            case photoChecker(form.dealingPhoto.value):
                                errorMsg = `${this.form.tips.pleaseUpload + form.dealingPhoto.title}！`;
                                break;
                            case photoChecker(form.donePhoto.value):
                                errorMsg = `${this.form.tips.pleaseUpload + form.donePhoto.title}！`;
                                break;
                            case form.buildArea.value === "":
                                errorMsg = `${this.form.tips.pleaseInput + form.buildArea.title}！`;
                                break;
                            case form.missionDate.value === "":
                                errorMsg = `${this.form.tips.pleaseInput + form.missionDate.title}！`;
                                break;
                        }

                        return errorMsg;
                    }
                    //  摸查信息验证
                    , investigatePreChecker = () => {
                        let errorMsg = "";

                        switch (true) {
                            case this.form.buildingAddress.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.buildingAddress.title + "！";
                                break;
                            case this.form.propertyOwner.type.selectedValue !== this.propertyOwnerTypeEnum.unknown.value && this.form.propertyOwner.name.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.propertyOwner.name.title;
                                break;
                            case this.form.propertyOwner.type.selectedValue !== this.propertyOwnerTypeEnum.unknown.value && this.form.propertyOwner.credentialsNumber.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.propertyOwner.credentialsNumber.title;
                                break;
                            // case (this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.unit.value && ) || (this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.personal.value):
                            case this.form.coverArea.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.coverArea.title;
                                break;
                            case this.form.buildArea.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.buildArea.title;
                                break;
                            case this.form.buildingStorey.value === "":
                                errorMsg = this.form.tips.pleaseInput + form.buildingStorey.title;
                                break;
                            case this.form.buildingStartDate.value === "":
                                errorMsg = this.form.tips.pleaseSelect + form.buildingStartDate.value;
                                break;
                            case this.form.buildingEndDate.value === "":
                                errorMsg = this.form.tips.pleaseSelect + form.buildingEndDate.value;
                                break;
                            case !this.form.useFor.list.find(item => item.checked):
                                errorMsg = this.form.tips.pleaseSelect + form.useFor.title;
                                break;
                            case !!this.form.certificate.list.find(item => item.selected && (item.numberValue === "" || item.nameValue === "")):
                                errorMsg = this.form.tips.pleaseInput + form.certificate.title;
                                break;
                            case !this.form.illegalType.list.find(item => item.checked):
                                errorMsg = this.form.tips.pleaseSelect + form.illegalType.title;
                                break;
                            case !!this.form.otherEvidence.list.find(item => item.selected && (item.filePaths.length === 0 || !!item.filePaths.find(file => !!file.error || !!file.loading))):
                                errorMsg = this.form.tips.pleaseUpload + form.otherEvidence.title + "图片";
                                break;
                            case !!this.form.joinerMsg.list.find(item => item.value === ""):
                                errorMsg = this.form.tips.pleaseInput + (this.form.joinerMsg.list.find(item => item.value === "") || {title: "未知"}).title;
                                break;
                        }

                        return errorMsg;
                    }
                    //  获取摸查记录要提交的数据
                    , getInvestigateRequestData = () => {
                        const joinerObj = {};

                        form.joinerMsg.list.forEach(item => {
                            joinerObj[item.name] = item.value;
                        });

                        return {
                            accessToken,
                            buildingAddress: form.buildingAddress.value,
                            propertyOwnerType: form.propertyOwner.type.selectedValue,
                            propertyOwnerName: form.propertyOwner.name.value,
                            credentialsType: form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.unit.value ? form.propertyOwner.credentialsType.unitList[form.propertyOwner.credentialsType.unitSelectedIndex].value : form.propertyOwner.credentialsType.personalList[form.propertyOwner.credentialsType.personalSelectedIndex].value,
                            credentialsNumber: form.propertyOwner.credentialsNumber.value,
                            relativeGovernment: form.propertyOwner.relative.government.selected,
                            relativeArmedForces: form.propertyOwner.relative.armedForces.selected,
                            belongType: form.belongType.list[form.belongType.selectedIndex].value,
                            landType: form.landType.list[form.landType.selectedIndex].value,
                            isCurtilage: form.curtilage.selected,
                            coverArea: form.coverArea.value,
                            buildArea: form.buildArea.value,
                            buildingStorey: Number(form.buildingStorey.value),
                            buildingStartDate: form.buildingStartDate.value,
                            buildingEndDate: form.buildingEndDate.value,
                            engineeringSituation: form.engineeringSituation.list[form.engineeringSituation.selectedIndex].value,
                            engineeringAge: form.engineeringAge.list[form.engineeringAge.selectedIndex].value,
                            useFor: form.useFor.list.filter(item => item.checked).map(item => item.value),
                            certificate: form.certificate.list.map(item => ({
                                selected: item.selected,
                                name: item.nameValue || "",
                                number: item.numberValue || ""
                            })),
                            illegalType: form.illegalType.list.filter(item => item.checked).map(item => item.value),
                            otherEvidence: form.otherEvidence.list.map(item => ({
                                selected: item.selected,
                                value: item.value,
                                filePaths: item.filePaths.filter(item => !item.error && !item.loading).map(item => item.url)
                            })),
                            ...joinerObj,
                        }
                    }
                ;

                this.form.error.msg = form.msgType.value === form.msgType.enum.investigate.value ? investigatePreChecker() : dealPreChecker();
                if (this.form.error.msg) {
                    // util.showToast(form.error.msg);
                    this.form.error.isShow = true;
                    if (this.form.error.msg === cn.user.noSignIn) {
                        setTimeout(() => {
                            util.switchTo({
                                url: memberRoute.user
                            });
                        }, baseConfig.delay * 2000);
                    }
                    setTimeout(() => {
                        this.form.error.isShow = false;
                    }, baseConfig.delay * 3000);
                    // util.showToast(this.form.error.msg);

                    return false;
                }
                //  新增
                if (this.handlerType === "add") {
                    if (form.msgType.value === form.msgType.enum.investigate.value) {
                        //  创建摸查记录
                        editMissionRecordPromise = this.providerMissionRecord.createInvestigateMissionRecord(
                            {
                                ...getInvestigateRequestData()
                            }
                        );
                    } else {
                        //  调用治理接口
                        editMissionRecordPromise = this.providerMissionRecord.createDealMissionRecord(
                            {
                                investigateId: form.investigateId,
                                buildType:
                                form.buildType.list[form.buildType.selectedIndex].value,
                                belongArea: form.belongArea.value,
                                buildName: form.buildName.value,
                                targetUnit: form.targetUnit.value,
                                buildArea: form.buildArea.value,
                                beforePhoto: form.beforePhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                dealingPhoto: form.dealingPhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                donePhoto: form.donePhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                missionDate: form.missionDate.value,
                                accessToken
                            }
                        );
                    }
                }
                //  编辑提交
                else {
                    if (form.msgType.value === form.msgType.enum.investigate.value) {
                        //  修改摸查信息
                        editMissionRecordPromise = this.providerMissionRecord.updateInvestigateMissionRecord(
                            {
                                id: form.investigateId,
                                ...getInvestigateRequestData()
                            }
                        );
                    } else {
                        editMissionRecordPromise = this.providerMissionRecord.updateDealMissionRecord(
                            {
                                id: form.dealId,
                                buildType:
                                form.buildType.list[form.buildType.selectedIndex].value,
                                belongArea: form.belongArea.value,
                                buildName: form.buildName.value,
                                targetUnit: form.targetUnit.value,
                                buildArea: form.buildArea.value,
                                beforePhoto: form.beforePhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                dealingPhoto: form.dealingPhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                donePhoto: form.donePhoto.value
                                    .filter(item => !item.loading && !item.error)
                                    .map(item => item.url),
                                missionDate: form.missionDate.value,
                                accessToken
                            }
                        );
                    }
                }
                editMissionRecordPromise
                    .then(res => {
                        switch (res.status) {
                            //  成功
                            case 1000:
                                util.showToast("提交成功！");
                                this.msg.id = res.data.id;
                                this.msg.isShow = true;
                                break;
                            //  失败
                            case 1001:
                                util.showToast(res.msg);
                                break;
                            //  未知错误
                            default:
                                util.showToast(
                                    `创建任务记录出现${cn.global.error.errorUnknown}：` +
                                    JSON.stringify(res)
                                );
                                break;
                        }
                    })
                    .catch(err => {
                        util.showToast("更新任务记录接口异常：" + JSON.stringify(err));
                    });
            },
            /**
             * 显示日期选择器
             * @param {string} type 选择类型
             */
            showDatePicker(type) {
                window.weui.datePicker({
                    start: this.form[type].startDate,
                    end: this.form[type].endDate,
                    onChange: result => {
                        console.log("选择修改中：" + result);
                    },
                    onConfirm: result => this.recordDateChange(result.reduce((prev, item) => prev + (item.value.toString().length > 1 ? item.label : "0" + item.label), ""), type),
                    title: this.form[type].title
                });
            },
            //  选择是否政府相关阻止
            toggleIsGovernment() {
                this.form.propertyOwner.relative.government.selected = !this.form.propertyOwner.relative.government.selected;
            },
            //  选择是否军队相关组织
            toggleIsArmedForces() {
                this.form.propertyOwner.relative.armedForces.selected = !this.form.propertyOwner.relative.armedForces.selected;
            },
            //  选择是否为宅基地
            toggleCurtilage() {
                this.form.curtilage.selected = !this.form.curtilage.selected;
            },
            /**
             * 切换证书是否存在
             * @param {number} index 证书索引值
             * */
            toggleCertificate(index) {
                var curItem = this.form.certificate.list[index];

                curItem.selected = !curItem.selected;
                this.$set(this.form.certificate.list, index, curItem);
            },
            /**
             * 日期更改事件处理
             * @param {string} value 选择的日期时间
             * @param {string} type 选择的类型
             */
            recordDateChange(value, type) {
                this.form[type].value = value;
            },
            //  修改建设类型
            buildTypeChange(value) {
                let {form} = this,
                    currentIndex = form.buildType.list.findIndex(
                        item => item.value === value
                    );
                if (currentIndex > -1) {
                    this.form.buildType.selectedIndex = currentIndex;
                } else {
                    console.log(`没有正确的${this.form.buildType.title}选项可选`);
                }
            },
            /**
             * 选择权属人类型
             * @param {number} value 类型标识
             */
            selectPropertyOwnerType(value) {
                this.form.propertyOwner.type.selectedValue = value;
            },
            /**
             * 选择证件类型
             * @param {number} index 类型索引值
             */
            selectCredentialsType(index) {
                this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.unit.value ? (this.form.propertyOwner.credentialsType.unitSelectedIndex = index) : (this.form.propertyOwner.credentialsType.personalSelectedIndex = index);
            },
            /**
             * 选择所处区域
             * @param {number} index 选择的索引值
             */
            selectBelongTypeByIndex(index) {
                this.form.belongType.selectedIndex = index;
            },
            /**
             * 选择土地性质
             * @param {number} index 选择的索引值
             */
            selectLandTypeByIndex(index) {
                this.form.landType.selectedIndex = index;
            },
            /**
             * 选择工程现状
             * @param {number} index 选择的索引值
             */
            selectEngineeringSituationByIndex(index) {
                this.form.engineeringSituation.selectedIndex = index;
            },
            /**
             * 选择工程新旧
             * @param {number} index 选择的索引值
             */
            selectEngineeringAgeByIndex(index) {
                this.form.engineeringAge.selectedIndex = index;
            },
            /**
             * 选择/反选用途
             * @param {number} index 用途索引值
             * */
            selectUseFor(index) {
                let useForItem = this.form.useFor.list[index];

                useForItem.checked = !useForItem.checked;
                this.$set(this.form.useFor.list, index, useForItem);
            },
            /**
             * 选择/反选违建类型
             * @param {number} index 违建索引值
             * */
            selectIllegalType(index) {
                let illegalTypeItem = this.form.illegalType.list[index];

                illegalTypeItem.checked = !illegalTypeItem.checked;
                this.$set(this.form.illegalType.list, index, illegalTypeItem);
            },
            /**
             * 选择其他证据
             * @param {number} index 证据索引值
             * */
            selectOtherEvidenceByIndex(index) {
                let curItem = this.form.otherEvidence.list[index];

                curItem.selected = !curItem.selected;
                this.$set(this.form.otherEvidence.list, index, curItem);
            },
            /**
             * 点击已上传的图片，显示或者重新选择提交
             * @param index {number} 索引值
             * @param type {string} 文件归属类型
             * @param imageUrl {string} 图片路径
             * @param custom {object} 自定义内容
             */
            uploadPhotoClick(index, type, imageUrl, custom = {}) {
                this.gallery.imageUrl = imageUrl;
                this.gallery.isShow = true;
                this.gallery.targetData = {
                    index,
                    type,
                    custom
                };
            },
            /**
             * 选择了要上传的文件
             * @param e {Event} 事件对象
             * @param type {string} 文件归属类型
             * @param custom {object} 自定义文件
             */
            selectedUploadFile(e, type, custom) {
                const isOtherEvidence = type === "otherEvidence"
                    ,
                    offsetIndex = isOtherEvidence ? this.form[type].list[custom.index].filePaths.length : this.form[type].value.length;
                let src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;

                for (let i = 0, len = files.length; i < len; ++i) {
                    let file = files[i];

                    if (url) {
                        src = url.createObjectURL(file);
                    } else {
                        src = e.target.result;
                    }
                    const fileObj = {
                        url: src,
                        loading: true,
                        error: false
                    };

                    if (isOtherEvidence) {
                        this.form[type].list[custom.index].filePaths.push(fileObj);
                    } else {
                        this.form[type].value.push(fileObj);
                    }
                }
                this.uploadFile(files)
                    .then(res => {
                        //  更新文件上传状态
                        res.urls.forEach((url, index) => {
                            this.$set(isOtherEvidence ? this.form[type].list[custom.index].filePaths : this.form[type].value, offsetIndex + index, {
                                url,
                                loading: false,
                                error: false
                            });
                        });
                    })
                    .catch(err => {
                        [].forEach.call(files, (url, index) => {
                            const currentIndex = offsetIndex + index;
                            let curItem = isOtherEvidence ? this.form[type].list[custom.index].filePaths[currentIndex] : this.form[type].value[currentIndex];

                            curItem.error = true;
                            curItem.loading = false;
                            this.$set(isOtherEvidence ? this.form[type].list[custom.index].filePaths : this.form[type].value, currentIndex, curItem);
                            util.showToast(err);
                        });
                    })
                ;
            },
            //  总处理上传文件
            uploadFile(file) {
                console.log("进入文件上传处理：" + JSON.stringify(file));

                return util.uploadFile({
                    filePath: file
                })
                    .catch(err =>
                        Promise.reject("上传图片接口异常：" + JSON.stringify(err))
                    )
                    .then(res => {
                        let resultPromise;

                        switch (res.status) {
                            //  成功
                            case 1000:
                                resultPromise = Promise.resolve({
                                    urls: res.data.buildingPhotoFilePath
                                });
                                break;
                            //    失败
                            case 1001:
                                resultPromise = Promise.reject("上传失败：" + res.msg);
                                break;
                            //    未知错误
                            default:
                                resultPromise = Promise.reject("未知错误");
                                break;
                        }

                        return resultPromise;
                    });
            },
            //  初始化目标辖区选择
            initTargetStreet() {
                let {form} = this;

                this.getRegion(
                    form.belongArea.list[form.belongArea.selectedIndex].id,
                    resData => {
                        let {form} = this;

                        this.$set(this.form.targetUnit, "list", resData.map(item => {
                            return {
                                id: item.Id,
                                regionName: item.RegionName
                            };
                        }));
                        if (form.targetUnit.value) {
                            form.targetUnit.list.forEach((item, index) => {
                                if (item.regionName === form.targetUnit.value) {
                                    this.form.targetUnit.selectedIndex = index;
                                }
                            });
                        } else if (form.targetUnit.list.length) {
                            this.form.targetUnit.selectedIndex = 0;
                            this.form.targetUnit.value =
                                form.targetUnit.list[form.targetUnit.selectedIndex].regionName;
                        }
                    }
                );
            },
            //  获取地区
            getRegion(regionId, callback) {
                this.providerSetting.getRegion(regionId).then(res => {
                    switch (res.status) {
                        //  成功
                        case 1000:
                            callback(res.data);
                            break;
                        //   失败
                        case 1001:
                        default:
                            util.showToast("获取地区接口出现错误：" + JSON.stringify(res));
                            break;
                    }
                });
            }
        },
        mounted() {
            const dateFormat = "yyyy-MM-dd", //  日期格式
                {form} = this,
                options = Request.getAllParams(),
                msgType = Number(
                    options[baseConfig.query.msgType] || form.msgType.enum.investigate.value
                );  //  信息类型
            let date = new Date()
                , dateForDatePicker = new DateUtil(date).pattern(dateFormat)
                , limitEarliestDate = +date - 100 * 365 * 24 * 60 * 60 * 1000    //    限制的最早日期
                , resultPromise
            ;

            this.handlerType = options.handlerType || "add";
            this.form.investigateId = Number(
                options[baseConfig.query.investigateMissionRecordId] || 0
            );
            this.form.dealId = Number(
                options[baseConfig.query.dealMissionRecordId] || 0
            );
            //  确定要填写的信息类型
            this.form.msgType.value =
                msgType === form.msgType.enum.deal.value
                    ? msgType
                    : form.msgType.enum.investigate.value;
            //  对不同信息类型进行处理
            if (form.msgType.value === form.msgType.enum.investigate.value) {
                Object.values(this.propertyOwnerTypeEnum).forEach(item => this.form.propertyOwner.type.list.push(item));
                this.form.propertyOwner.type.list.length && (this.form.propertyOwner.type.selectedValue = this.form.propertyOwner.type.list[0].value);
                Object.values(this.unitCredentialsTypeEnum).forEach(item => this.form.propertyOwner.credentialsType.unitList.push(item));
                Object.values(this.personalCredentialsTypeEnum).forEach(item => this.form.propertyOwner.credentialsType.personalList.push(item));
                Object.values(this.belongTypeEnum).forEach(item => this.form.belongType.list.push(item));
                Object.values(this.landTypeEnum).forEach(item => this.form.landType.list.push(item));
                Object.values(this.engineeringSituationTypeEnum).forEach(item => this.form.engineeringSituation.list.push(item));
                Object.values(this.engineeringAgeTypeEnum).forEach(item => this.form.engineeringAge.list.push(item));
                Object.values(this.useForTypeEnum).forEach(item => this.form.useFor.list.push({
                    title: item.title,
                    value: item.value,
                    checked: false
                }));
                Object.values(this.illegalTypeEnum).forEach(item => this.form.illegalType.list.push({
                    title: item.title,
                    value: item.value,
                    checked: false
                }));
                Object.keys(this.certificateEnum).forEach(key => {
                    const item = this.certificateEnum[key];

                    item.name = key;
                    item.selected = item.selected || false;
                    item.nameTitle && (item.nameValue = item.nameValue || "");
                    item.numberValue = item.numberValue || "";
                    this.form.certificate.list.push(item);
                });
                Object.values(this.otherEvidenceTypeEnum).forEach(item => {
                    this.form.otherEvidence.list.push({
                        selected: false
                        , title: item.title
                        , value: item.value
                        , maxCount: this.form.fileMaxCount
                        , filePaths: getUploadImageFileArr()
                    });
                });
                this.form.buildingStartDate.value = this.form.buildingEndDate.value = AdapterMissionRecord.dateToShow(dateForDatePicker);
            } else {
                this.form.buildArea.title = cn.missionRecord.buildAreaTitleForDeal;
                this.form.missionDate.value = AdapterMissionRecord.dateToShow(dateForDatePicker);
            }
            //  对不同操作类型处理
            switch (this.handlerType) {
                //  查看
                case "check":
                    break;
                // 编辑，需要处理摸查和治理的信息获取
                case "edit":
                    if (form.investigateId || form.dealId) {
                        const accessToken = this.providerUser.getAccessToken()
                            , getLatestDate = (date1, date2) => {
                                const val1 = +new Date(date1)
                                    , val2 = +new Date(date2)
                                ;

                                return val1 < val2 ? date2 : date1;
                            }
                        ;
                        let {form} = this,
                            adapterPhotoValue = valueStr => {
                                return valueStr ? valueStr.split(",").map(url => {
                                    return {
                                        url,
                                        error: false,
                                        loading: false
                                    };
                                }) : [];
                            };
                        if (form.msgType.value === form.msgType.enum.investigate.value) {
                            resultPromise = this.providerMissionRecord
                                .getInvestigateRecordDetail(form.investigateId, accessToken)
                                .then(res => {
                                    switch (res.status) {
                                        //  成功，显示内容
                                        case 1000:
                                            this.form.investigateId = res.data.id;
                                            this.form.dealId = res.data.gbId;
                                            this.form.codeNumber.value = res.data.codeNumber;
                                            this.form.buildingAddress.value = res.data.buildingAddress;
                                            this.form.propertyOwner.type.selectedValue = res.data.propertyOwnerType;
                                            this.form.propertyOwner.name.value = res.data.propertyOwnerName;
                                            if (this.form.propertyOwner.type.selectedValue !== this.propertyOwnerTypeEnum.unknown.value) {
                                                this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.unit.value ? (this.form.propertyOwner.credentialsType.unitSelectedIndex = this.form.propertyOwner.credentialsType.unitList.findIndex(item => item.value === res.data.credentialsType)) : (this.form.propertyOwner.credentialsType.personalSelectedIndex = this.form.propertyOwner.credentialsType.personalList.findIndex(item => item.value === res.data.credentialsType));
                                            }
                                            this.form.propertyOwner.credentialsNumber.value = res.data.credentialsNumber;
                                            this.form.propertyOwner.relative.government.selected = res.data.relativeGovernment;
                                            this.form.propertyOwner.relative.armedForces.selected = res.data.relativeArmedForces;
                                            this.form.belongType.selectedIndex = this.form.belongType.list.findIndex(item => item.value === res.data.belongType);
                                            this.form.landType.selectedIndex = this.form.landType.list.findIndex(item => item.value === res.data.landType);
                                            this.form.curtilage.selected = res.data.isCurtilage;
                                            this.form.coverArea.value = res.data.coverArea;
                                            this.form.buildArea.value = res.data.buildArea;
                                            this.form.buildingStorey.value = res.data.buildingStorey;
                                            this.form.buildingStartDate.value = res.data.buildingStartDate;
                                            this.form.buildingEndDate.value = res.data.buildingEndDate;
                                            this.form.engineeringSituation.selectedIndex = this.form.engineeringSituation.list.findIndex(item => item.value === res.data.engineeringSituation);
                                            this.form.engineeringAge.selectedIndex = this.form.engineeringAge.list.findIndex(item => item.value === res.data.engineeringAge);
                                            (() => {
                                                let useForCheckedObj = {};  //  将已选的用途标识映射成键值对形式

                                                res.data.useFor.forEach(value => {
                                                    useForCheckedObj[value] = true;
                                                });
                                                this.form.useFor.list.forEach(item => {
                                                    if (useForCheckedObj[item.value]) {
                                                        item.checked = true;
                                                    }
                                                });
                                            })();
                                            this.form.certificate.list.forEach(certItem => {
                                                const itemData = res.data.certificate[certItem.name];

                                                if (itemData) {
                                                    certItem.selected = itemData.selected;
                                                    itemData.nameValue && (certItem.nameValue = itemData.nameValue);
                                                    itemData.numberValue && (certItem.numberValue = itemData.numberValue);
                                                }
                                            });
                                            (() => {
                                                let illegalTypeCheckedObj = {}; //  将已选的违法建设性质映射为键值对形式

                                                res.data.illegalType.forEach(value => {
                                                    illegalTypeCheckedObj[value] = true;
                                                });
                                                this.form.illegalType.list.forEach(illegalItem => {
                                                    if (illegalTypeCheckedObj[illegalItem.value]) {
                                                        illegalItem.checked = true;
                                                    }
                                                });
                                            })();
                                            (() => {
                                                let otherEvidenceObj = {};  //  将已有的其他证据内容映射为对象

                                                res.data.otherEvidence.forEach(item => {
                                                    otherEvidenceObj[item.value] = item;
                                                });
                                                this.form.otherEvidence.list.forEach((item, index) => {
                                                    const curTarget = otherEvidenceObj[item.value];

                                                    if (curTarget) {
                                                        item.selected = curTarget.selected;
                                                        item.filePaths = curTarget.filePaths.map(url => {
                                                            return {
                                                                url
                                                                , loading: false
                                                                , error: false
                                                            };
                                                        });
                                                        this.$set(this.form.otherEvidence.list, index, item);
                                                    }
                                                });
                                            })();
                                            this.form.joinerMsg.list.forEach(joinerItem => {
                                                const joinerData = res.data[joinerItem.name];

                                                if (joinerData) {
                                                    joinerItem.value = joinerData;
                                                }
                                            });
                                            break;
                                        default:
                                            util.showToast(
                                                "获取摸查任务记录详情未知错误:" + JSON.stringify(res)
                                            );
                                            break;
                                    }
                                });
                        } else {
                            resultPromise = this.providerMissionRecord
                                .getDealRecordDetail(form.dealId, accessToken)
                                .then(res => {
                                    switch (res.status) {
                                        //  成功
                                        case 1000:
                                            this.form.investigateId = res.data.palpationId;
                                            this.form.dealId = res.data.id;
                                            this.form.codeNumber.value = res.data.number;
                                            this.form.belongArea.value = res.data.region;
                                            this.form.targetUnit.value = res.data.jurisdiction;
                                            this.form.buildType.list.forEach((item, index) => {
                                                if (item.value === String(res.data.infoType)) {
                                                    this.form.buildType.selectedIndex = index;
                                                }
                                            });
                                            this.form.buildName.value = res.data.position;
                                            this.form.buildArea.value = res.data.area;
                                            this.form.buildSituation.value = res.data.nowStatus;
                                            this.form.missionDate.value = res.data.dismantleDate;
                                            // this.form.missionDate.endDate = getLatestDate(this.form.missionDate.value, date);
                                            this.form.beforePhoto.value = adapterPhotoValue(
                                                res.data.imageData1
                                            );
                                            this.form.dealingPhoto.value = adapterPhotoValue(
                                                res.data.imageData2
                                            );
                                            this.form.donePhoto.value = adapterPhotoValue(
                                                res.data.imageData3
                                            );
                                            break;
                                        //  失败
                                        case 1001:
                                        //  未知错误
                                        default:
                                            util.showToast(
                                                "获取治理任务记录详情未知错误:" + JSON.stringify(res)
                                            );
                                            break;
                                    }
                                });
                        }
                        resultPromise.catch(err => {
                            util.showToast("获取任务记录详情接口异常：" + JSON.stringify(err));
                        });
                    } else {
                        util.showToast("缺少任务记录标识，无法编辑");
                    }
                    break;
                //  新增
                case "add":
                default:
                    //  对可选择的内容进行预选
                    break;
            }
            //  补充公用配置信息
            this.form.buildingStartDate.startDate = this.form.buildingEndDate.startDate = this.form.missionDate.startDate = new DateUtil(
                new Date(limitEarliestDate)
            ).pattern(dateFormat);
            this.form.buildingStartDate.endDate = dateForDatePicker;
            this.form.buildingEndDate.endDate = dateForDatePicker;
            this.form.missionDate.endDate = dateForDatePicker;
            //  对用户可用的信息进行预填
            userDataPromise.then(() => {
                this.addDisabled = !app.globalData.isSignIn || app.globalData.user.rank > this.userRankEnum.street.value;
                !form.belongArea.value && (this.form.belongArea.value = app.globalData.user.region.belongArea.name);
                !form.targetUnit.value && app.globalData.user.rank === this.userRankEnum.street.value && (this.form.targetUnit.value = app.globalData.user.currentUnit);
                //  获取可选地区
                if (this.handlerType === "add" || this.handlerType === "edit") {
                    Promise.all([
                        resultPromise,
                        new Promise(resolve =>
                            this.getRegion(app.globalData.user.region.city.id, resolve)
                        )
                    ]).then(([infoData, regionRes]) => {
                        console.log(infoData);
                        this.$set(this.form.belongArea, "list", regionRes.map(item => {
                            return {
                                id: item.Id,
                                regionName: item.RegionName
                            };
                        }));
                        //  已有预填入值的情况
                        if (this.form.belongArea.value) {
                            this.form.belongArea.list.forEach((item, index) => {
                                if (item.regionName === this.form.belongArea.value) {
                                    this.form.belongArea.selectedIndex = index;
                                }
                            });
                        }
                        //  没有预填入值，使用第一个地区
                        else if (this.form.belongArea.list.length) {
                            this.form.belongArea.selectedIndex = 0;
                            this.form.belongArea.value =
                                this.form.belongArea.list[this.form.belongArea.selectedIndex].regionName;
                        } else {
                            util.showToast("没有可选地区，无法正常选择");
                        }
                        //  有选择地区的情况下，继续提前加载可选辖区
                        if (this.form.belongArea.selectedIndex > -1) {
                            this.initTargetStreet();
                        }
                        this.form.error.isShow = false;
                    });
                }
            })
                .catch(err => {
                    util.showToast(cn.user.noSignIn);
                    util.switchTo({
                        url: memberRoute.user
                    });
                });
        }
    };
</script>

<style scoped>
    @import "add.css";

    .weui-cells {
        margin-top: 0;
    }

    .weui-cells__group_form .weui-cells__title {
        background: #fcfcfc;
        margin: 0;
        padding: 24px 32px;
    }

    .handler {
        min-height: 500px;
    }
</style>